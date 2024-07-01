import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Post } from '../interfaces/post';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { AuthData } from '@app/interfaces/auth-data';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiURL = 'http://localhost:8080/api/users';

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
    return this.http.get<Post[]>(`${this.apiURL}/${userId}/favorites`);
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

  saveMeme(userId: number, memeId: number): Observable<string> {
    return this.http.post<string>(`${this.apiURL}/${userId}/memes/${memeId}`, {});
  }

  unsaveMeme(userId: number, memeId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiURL}/${userId}/memes/${memeId}`);
  }
}
