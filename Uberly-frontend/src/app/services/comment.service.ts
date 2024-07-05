import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment } from '@app/interfaces/comment';
import { CommentDto } from '@app/interfaces/comment-dto';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private commentsByPost: { [postId: number]: Comment[] } = {};
  commentsByPostSub = new BehaviorSubject<{ [postId: number]: Comment[] }>({});

  apiURL = 'http://localhost:8080/api/comments';

  constructor(private http: HttpClient) { }

  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiURL}/posts/${postId}`).pipe(
      tap(comments => {
        this.commentsByPost[postId] = comments;
        this.commentsByPostSub.next(this.commentsByPost);
      })
    );
  }

  getCommentById(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiURL}/${id}`);
  }

  createComment(commentDTO: CommentDto): Observable<string> {
    return this.http.post<string>(this.apiURL, commentDTO, { responseType: 'text' as 'json' }).pipe(
      tap(() => {
        if (commentDTO.postId) {
          this.refreshCommentsByPost(commentDTO.postId);
        }
      })
    );
  }

  getAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiURL);
  }

  updateComment(id: number, comment: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiURL}/${id}`, comment, { responseType: 'text' as 'json' }).pipe(
      tap(() => {
        if (comment.postId) {
          this.refreshCommentsByPost(comment.postId);
        }
      })
    );
  }

  deleteComment(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiURL}/${id}`, { responseType: 'text' as 'json' }).pipe(
      tap(() => {
        for (const postId in this.commentsByPost) {
          if (this.commentsByPost.hasOwnProperty(postId)) {
            const comments = this.commentsByPost[postId];
            const index = comments.findIndex(comment => comment.id === id);
            if (index !== -1) {
              comments.splice(index, 1);
              this.commentsByPostSub.next({ ...this.commentsByPost });
              break;
            }
          }
        }
      })
    );
  } 

  refreshCommentsByPost(postId: number): void {
    this.getCommentsByPostId(postId).subscribe();
  }
}
