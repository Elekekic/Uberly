import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reaction } from '../interfaces/reaction';
import { Post } from '@app/interfaces/post';

@Injectable({
  providedIn: 'root',
})
export class ReactionService {
  apiURL = 'https://magnetic-kathlin-kekice-0533f74d.koyeb.app/api';
  /* apiURL = 'http://localhost:8080/api'; */

  constructor(private http: HttpClient) {}

  getAllReactions(): Observable<Reaction[]> {
    return this.http.get<Reaction[]>(`${this.apiURL}/reactions`);
  }

  getReactionsByPostId(postId: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiURL}/reactions/post/${postId}`);
  }

  getReactionById(id: number): Observable<Reaction> {
    return this.http.get<Reaction>(`${this.apiURL}/reactions/${id}`);
  }

  addAReaction(reaction: Reaction): Observable<Reaction> {
    return this.http.post<Reaction>(`${this.apiURL}/reactions`, reaction, {
      responseType: 'text' as 'json',
    });
  }

  deleteReaction(reactionId: number): Observable<String> {
    return this.http.delete<string>(`${this.apiURL}/reactions/${reactionId}`);
  }
}
