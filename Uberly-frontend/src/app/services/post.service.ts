import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../interfaces/post';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Tags } from '../interfaces/tags';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private postsByUser: Post[] = [];
  postsByUserSub = new BehaviorSubject<Post[]>([]);

  apiURL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiURL}/posts`);
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiURL}/posts/${id}`);
  }

  getRecentPostsForFollowedUsers(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiURL}/posts/recent/${userId}`);
  }

  savePost(postDTO: Post): Observable<Post> {
    return this.http.post<Post>(`${this.apiURL}/posts`, postDTO).pipe(
      tap(() => this.refreshPostsByUser(postDTO.user.id))
    );
  }

  updatePost(id: number, postDTO: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiURL}/posts/${id}`, postDTO).pipe(
      tap(() => this.refreshPostsByUser(postDTO.user.id))
    );
  }

  deletePost(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiURL}/posts/${id}`, { responseType: 'text' as 'json' }).pipe(
      tap(() => {
        const postIndex = this.postsByUser.findIndex(post => post.id === id);
        if (postIndex !== -1) {
          this.postsByUser.splice(postIndex, 1);
          this.postsByUserSub.next([...this.postsByUser]);
        }
      })
    );
  }

  getPostsByUser(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiURL}/posts/users/${userId}`).pipe(
      tap(posts => {
        this.postsByUser = posts;
        this.postsByUserSub.next(this.postsByUser);
      })
    );
  }

  getPostsByStartingPoint(startPoint: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiURL}/posts/start/${startPoint}`);
  }

  getPostsByEndPoint(endPoint: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiURL}/posts/end/${endPoint}`);
  }

  getPostsByTag(tag: Tags): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiURL}/posts/tags/${tag}`);
  }

  refreshPostsByUser(userId: number): void {
    this.getPostsByUser(userId).subscribe();
  }
}