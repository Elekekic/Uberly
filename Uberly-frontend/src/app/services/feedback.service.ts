import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeedbackDTO } from '@app/interfaces/feedback-dto';
import { Feedbacks } from '@app/interfaces/feedbacks';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private feedbacksAuthor: Feedbacks[] = [];
  feedbacksAuthorSub = new BehaviorSubject<Feedbacks[]>([]);

  private feedbacksRecipient: Feedbacks[] = [];
  feedbacksRecipientSub = new BehaviorSubject<Feedbacks[]>([]);

    apiURL = 'https://outer-lane-kekice-635da50d.koyeb.app/api';
/*   apiURL = 'http://localhost:8080/api'; */

  constructor(private http: HttpClient) {}

  createFeedback(feedbackDTO: FeedbackDTO): Observable<Feedbacks> {
    return this.http
      .post<Feedbacks>(`${this.apiURL}/feedbacks`, feedbackDTO, {
        responseType: 'text' as 'json',
      })
      .pipe(
        tap(() => {
          this.refreshFeedbacksByRecipient(feedbackDTO.recipientId);
        })
      );
  }

  updateFeedback(
    feedBackId: number,
    feedbackUpdateDTO: Feedbacks
  ): Observable<string> {
    return this.http
      .put<string>(
        `${this.apiURL}/feedbacks/${feedBackId}`,
        feedbackUpdateDTO,
        { responseType: 'text' as 'json' }
      )
      .pipe(
        tap(() => {
          const authorFeedbackIndex = this.feedbacksAuthor.findIndex(
            (feedback) => feedback.id === feedBackId
          );
          const recipientFeedbackIndex = this.feedbacksRecipient.findIndex(
            (feedback) => feedback.id === feedBackId
          );
          if (recipientFeedbackIndex !== -1 && authorFeedbackIndex !== -1) {
            this.feedbacksAuthor.splice(authorFeedbackIndex, 1);
            this.feedbacksAuthorSub.next([...this.feedbacksAuthor]);

            this.feedbacksRecipient.splice(recipientFeedbackIndex, 1);
            this.feedbacksRecipientSub.next([...this.feedbacksRecipient]);
          }
        })
      );
  }

  getFeedbacksByAuthorId(authorId: number): Observable<Feedbacks[]> {
    return this.http
      .get<Feedbacks[]>(`${this.apiURL}/feedbacks/author/${authorId}`)
      .pipe(
        tap((feedbacks) => {
          this.feedbacksAuthor = feedbacks;
          this.feedbacksAuthorSub.next(this.feedbacksAuthor);
        })
      );
  }

  getFeedbacksByRecipientId(recipientId: number): Observable<Feedbacks[]> {
    return this.http
      .get<Feedbacks[]>(`${this.apiURL}/feedbacks/recipient/${recipientId}`)
      .pipe(
        tap((feedbacks) => {
          this.feedbacksRecipient = feedbacks;
          this.feedbacksRecipientSub.next(this.feedbacksRecipient);
        })
      );
  }

  deleteFeedback(feedBackId: number): Observable<string> {
    return this.http
      .delete<string>(`${this.apiURL}/feedbacks/${feedBackId}`, {
        responseType: 'text' as 'json',
      })
      .pipe(
        tap(() => {
          const authorFeedbackIndex = this.feedbacksAuthor.findIndex(
            (feedback) => feedback.id === feedBackId
          );
          const recipientFeedbackIndex = this.feedbacksRecipient.findIndex(
            (feedback) => feedback.id === feedBackId
          );
          if (recipientFeedbackIndex !== -1 && authorFeedbackIndex !== -1) {
            this.feedbacksAuthor.splice(authorFeedbackIndex, 1);
            this.feedbacksAuthorSub.next([...this.feedbacksAuthor]);

            this.feedbacksRecipient.splice(recipientFeedbackIndex, 1);
            this.feedbacksRecipientSub.next([...this.feedbacksRecipient]);
          }
        })
      );
  }

  refreshFeedbacksByAuthor(authorId: number): void {
    this.getFeedbacksByAuthorId(authorId).subscribe();
  }

  refreshFeedbacksByRecipient(recipientId: number): void {
    this.getFeedbacksByRecipientId(recipientId).subscribe();
  }
}
