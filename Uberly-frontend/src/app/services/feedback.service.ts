import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeedbackDTO } from '@app/interfaces/feedback-dto';
import { Feedbacks } from '@app/interfaces/feedbacks';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  
  apiURL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  createFeedback(feedbackDTO: FeedbackDTO): Observable<string> {
    return this.http.post<string>(`${this.apiURL}/feedbacks`, feedbackDTO,  { responseType: 'text' as 'json' })
  }

  updateFeedback(id: number, feedbackUpdateDTO: Feedbacks): Observable<string> {
    return this.http.put<string>(`${this.apiURL}/feedbacks/${id}`, feedbackUpdateDTO ,  { responseType: 'text' as 'json' })
  }

  getFeedbacksByAuthorId(authorId: number): Observable<Feedbacks[]> {
    return this.http.get<Feedbacks[]>(`${this.apiURL}/feedbacks/author/${authorId}`, { responseType: 'text' as 'json' })
  }

  deleteFeedback(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiURL}/feedbacks/${id}`,  { responseType: 'text' as 'json' })
  }
}
