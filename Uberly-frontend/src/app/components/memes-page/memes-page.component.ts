import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import { AuthData } from '@app/interfaces/auth-data';
import { Meme } from '@app/interfaces/meme';
import { MemeService } from '@app/services/meme.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-memes-page',
  templateUrl: './memes-page.component.html',
  styleUrls: ['./memes-page.component.scss']
})
export class MemesPageComponent implements OnInit {

  memes: Meme[] = [];
  filteredmemes: Meme[] = [];
  searching: string = '';
  loggedUser!: AuthData | null; 

  constructor(
    private memesService: MemeService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => (this.loggedUser = user));
    this.loadAllMemes();
  }

  loadAllMemes(): void {
    this.memesService.getAllMemes().subscribe(memes => {
      this.memes = memes;
      this.filteredmemes = memes;
      this.filter();
    });
  }

  filter(): void {
    const lowerCaseSearch = this.searching.toLowerCase().trim();

    this.filteredmemes = this.memes.filter(memes => {
      const matchesSearch = 
        memes.user.username.toLowerCase().includes(lowerCaseSearch) ||
        memes.user.name.toLowerCase().includes(lowerCaseSearch) ||
        memes.user.surname.toLowerCase().includes(lowerCaseSearch);
      const isNotLoggedInUser = this.loggedUser ? memes.user.id !== this.loggedUser.user.id : true;

      return matchesSearch && isNotLoggedInUser;
    });
  }
}
