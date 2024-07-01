import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Meme } from '../interfaces/meme';

@Injectable({
  providedIn: 'root'
})
export class MemeService {
 
  apiURL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getAllMemes(): Observable<Meme[]> {
    return this.http.get<Meme[]>(`${this.apiURL}/memes`);
  }

  getAllMemesByUserId(userId: number): Observable<Meme[]> {
    return this.http.get<Meme[]>(`${this.apiURL}/users/${userId}/memes`);
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
    return this.http.patch<string>(`${this.apiURL}/memes/${id}`, formData);
  }

  deleteMeme(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiURL}/memes/${id}`);
  }
}
