import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Post } from '../interfaces/post';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../interfaces/user';
import { AuthData } from '@app/interfaces/auth-data';
import { Meme } from '@app/interfaces/meme';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private favPostsByUser: Post[] = [];
  private favMemesByUser: Meme[] = [];
  favMemesByUserSub = new BehaviorSubject<Meme[]>([]);
  favPostsByUserSub = new BehaviorSubject<Post[]>([]);

  apiURL = 'https://outer-lane-kekice-635da50d.koyeb.app/api/users';
 /*  apiURL = 'http://localhost:8080/api/users'; */


  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiURL}`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiURL}/${id}`);
  }

  updateUser(id: number, user: AuthData): Observable<User> {
    return this.http.put<User>(`${this.apiURL}/${id}`, user);
  }

  deleteUser(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiURL}/${id}`,{ responseType: 'text' as 'json' });
  }

  patchPictureProfile(userId: number, pictureProfile: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('pictureProfile', pictureProfile, pictureProfile.name);

    return this.http.patch(`${this.apiURL}/${userId}`, formData);
  }

  getUsersByUsernameContaining(username: string): Observable<User[]> {
    const params = new HttpParams().set('username', username);
    return this.http.get<User[]>(`${this.apiURL}/search`, { params });
  }

  getSavedPostsByUserId(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiURL}/${userId}/favorites`).pipe(
      tap(posts => {
        this.favPostsByUser = posts;
        this.favPostsByUserSub.next(this.favPostsByUser);
      })
    );
  }

  getSavedMemesByUserId(userId: number): Observable<Meme[]> {
    console.log(`Fetching memes for user ID: ${userId}`);
    const url = `${this.apiURL}/${userId}/favoritesMemes`;
    console.log(`API URL: ${url}`);
  
    return this.http.get<Meme[]>(url).pipe(
      tap(memes => {
        console.log('API response:', memes);  // Log the API response
        this.favMemesByUser = memes;
        console.log('Updated favMemesByUser:', this.favMemesByUser);  // Log the updated state
        this.favMemesByUserSub.next(this.favMemesByUser);
        console.log('Data emitted via favMemesByUserSub');  // Confirm data emission
      })
    );
  }
  

  

  addSavedPost(userId: number, postId: number): Observable<void> {
    return this.http.post<void>(`${this.apiURL}/${userId}/favorites/${postId}`, {});
  }

  deleteSavedPost(userId: number, postId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${userId}/favorites/${postId}`, { responseType: 'text' as 'json' });
  }

  followUser(userId: number, followUserId: number): Observable<string> {
    return this.http.post(`${this.apiURL}/${userId}/follow/${followUserId}`, {}, { responseType: 'text' });
  }

  unfollowUser(userId: number, unfollowUserId: number): Observable<string> {
    
    return this.http.post(`${this.apiURL}/${userId}/unfollow/${unfollowUserId}`, {}, { responseType: 'text' });
  }

  getFollowingUsers(userId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiURL}/following/${userId}`);
  }

  getFollowersUsers(userId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiURL}/followers/${userId}`);
  }

  addSavedMeme(userId: number, memeId: number): Observable<string> {
    return this.http.post(`${this.apiURL}/${userId}/memes/${memeId}`, {}, { responseType: 'text' });
  }

  deleteSavedMeme(userId: number, memeId: number): Observable<string> {
    return this.http.delete(`${this.apiURL}/${userId}/memes/${memeId}`, { responseType: 'text' });
  }
}
