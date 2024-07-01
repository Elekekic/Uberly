import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  apiURL = 'http://localhost:8080/api/comments';

  constructor(private http: HttpClient) { }

  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiURL}/posts/${postId}`);
  }

  getCommentById(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiURL}/${id}`);
  }

  createComment(commentDTO: Comment): Observable<string> {
    return this.http.post<string>(this.apiURL, commentDTO);
  }

  getAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiURL);
  }

  updateComment(id: number, comment: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiURL}/${id}`, comment);
  }

  deleteComment(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiURL}/${id}`);
  }
}
