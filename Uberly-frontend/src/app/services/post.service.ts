import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../interfaces/post';
import { Observable } from 'rxjs';
import { Tags } from '../interfaces/tags';

@Injectable({
  providedIn: 'root'
})
export class PostService {

   apiURL = 'http://localhost:8080/api'

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
    return this.http.post<any>('http://localhost:8080/api/posts', postDTO, { responseType: 'text' as 'json' });
  }

  updatePost(id: number, postDTO: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiURL}/posts/${id}`, postDTO);
  }

  deletePost(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiURL}/posts/${id}`);
  }

  getPostsByUser(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiURL}/posts/users/${userId}`);
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
}
