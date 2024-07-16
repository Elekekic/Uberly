import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import { AuthData } from '@app/interfaces/auth-data';
import { User } from '@app/interfaces/user';
import { UserService } from '@app/services/user.service';
import { gsap } from 'gsap';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit{

  users: User[] = [];
  filteredUsers: User[] = []; 
  searching: string = '';
  loggedUser!: AuthData | null; 

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.loggedUser = user;
      this.loadAllPosts();
    });
    this.showLoader();
  }

  showLoader(): void {
    window.scrollTo(0, 0);
  }

  hideLoader(): void {
    const loader = document.querySelector('#loader');
    if (loader) {
      gsap.to(loader, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          loader.classList.add('hidden');
        },
      });
    }

    const body: HTMLElement | null = document.querySelector('.body');
    if (body) {
      body.style.opacity = '0';
      gsap.to(body, { opacity: 1, duration: 1 });
    }
  }

  loadAllPosts(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.filter();
      this.hideLoader(); 
    });
  }

  filter(): void {
    const lowerCaseSearch = this.searching.toLowerCase().trim();

    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = 
        user.role.toLowerCase().includes(lowerCaseSearch) ||
        user.surname.toLowerCase().includes(lowerCaseSearch) ||
        user.name.toLowerCase().includes(lowerCaseSearch) ||
        user.username.toLowerCase().includes(lowerCaseSearch);
      
      const isNotLoggedInUser = this.loggedUser ? user.id !== this.loggedUser.user.id : true;

      return matchesSearch && isNotLoggedInUser;
    });
  }
}
