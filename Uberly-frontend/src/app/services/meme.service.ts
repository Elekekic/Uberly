import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Meme } from '../interfaces/meme';
import { Post } from '@app/interfaces/post';

@Injectable({
  providedIn: 'root'
})
export class MemeService {

  private memesByUser: Meme[] = [];
  memesByUserSub = new BehaviorSubject<Meme[]>([]);
 
  apiURL = 'https://outer-lane-kekice-635da50d.koyeb.app/api';
  /* apiURL = 'http://localhost:8080/api' */

  constructor(private http: HttpClient) { }

  getAllMemes(): Observable<Meme[]> {
    return this.http.get<Meme[]>(`${this.apiURL}/memes`);
  }

  getAllMemesByUserId(userId: number): Observable<Meme[]> {
    return this.http.get<Meme[]>(`${this.apiURL}/users/${userId}/memes`).pipe(
      tap(memes => {
        this.memesByUser = memes;
        this.memesByUserSub.next(this.memesByUser);
      })
    );
  }

  getMemeById(id: number): Observable<Meme> {
    return this.http.get<Meme>(`${this.apiURL}/memes/${id}`);
  }

  saveMeme(userId: number, file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('url', file, file.name);

    return this.http.post(`${this.apiURL}/users/${userId}/memes`, formData, { responseType: 'text' });
  }

  updateMeme(id: number, file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('url', file, file.name);
    return this.http.patch<string>(`${this.apiURL}/memes/${id}`, formData, { responseType: 'text' as 'json' });
  }

  deleteMeme(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiURL}/memes/${id}`, { responseType: 'text' as 'json' } );
  }

  refreshPostsByUser(userId: number): void {
    this.getAllMemesByUserId(userId).subscribe();
  }
}
