import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reply } from '@app/interfaces/reply';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReplyService {
  private repliesByComment: { [commentId: number]: Reply[] } = {};
  repliesByCommentSub = new BehaviorSubject<{ [commentId: number]: Reply[] }>(
    {}
  );

  apiURL = 'https://outer-lane-kekice-635da50d.koyeb.app/api';
  /* apiURL = 'http://localhost:8080/api'; */

  constructor(private http: HttpClient) {}

  getReplyById(id: number): Observable<Reply> {
    return this.http.get<Reply>(`${this.apiURL}/replies/${id}`);
  }

  getRepliesByCommentId(commentId: number): Observable<Reply[]> {
    return this.http
      .get<Reply[]>(`${this.apiURL}/comments/${commentId}/replies`)
      .pipe(
        tap((replies) => {
          if (replies !== null) {
            this.repliesByComment[commentId] = replies;
          } else {
            this.repliesByComment[commentId] = [];
          }
          this.repliesByCommentSub.next(this.repliesByComment);
        })
      );
  }

  getAllReplies(): Observable<Reply[]> {
    return this.http.get<Reply[]>(`${this.apiURL}/replies`);
  }

  createReply(reply: Reply): Observable<Reply> {
    return this.http
      .post<Reply>(`${this.apiURL}/replies`, reply, { responseType: 'json' })
      .pipe(
        tap(() => {
          if (reply.commentId) {
            this.refreshRepliesByComment(reply.commentId);
          }
        })
      );
  }

  updateReply(id: number, reply: Reply): Observable<Reply> {
    return this.http
      .put<Reply>(`${this.apiURL}/replies/${id}`, reply, {
        responseType: 'json',
      })
      .pipe(
        tap(() => {
          if (reply.commentId) {
            this.refreshRepliesByComment(reply.commentId);
          }
        })
      );
  }

  deleteReply(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiURL}/replies/${id}`, {
        responseType: 'text' as 'json',
      }).pipe(
        tap(() => {
          for (const commentId in this.repliesByComment) {
            if (this.repliesByComment.hasOwnProperty(commentId)) {
              const replies = this.repliesByComment[commentId];
              const index = replies.findIndex((reply) => reply.id === id);
              if (index !== -1) {
                replies.splice(index, 1);
                this.repliesByCommentSub.next({ ...this.repliesByComment });
                break;
              }
            }
          }
        })
      );
    }


  refreshRepliesByComment(commentId: number): void {
    this.getRepliesByCommentId(commentId).subscribe();
  }
}
