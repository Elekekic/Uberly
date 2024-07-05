import { Component } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import { AuthData } from '@app/interfaces/auth-data';
import { Post } from '@app/interfaces/post';
import { Tags } from '@app/interfaces/tags';
import { User } from '@app/interfaces/user';
import { PostService } from '@app/services/post.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-for-you-page',
  templateUrl: './for-you-page.component.html',
  styleUrls: ['./for-you-page.component.scss']
})
export class ForYouPageComponent {

  
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  tags: Tags[] = [];
  searching: string = '';
  loggedUser!: AuthData | null; 

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private userService: UserService
  ) {}
  ngOnInit(): void {
      this.authService.user$.subscribe((user) => (this.loggedUser = user));
      this.loadAllPosts();
      this.filter();
  }

  loadAllPosts(): void {
    this.postService.getAllPosts().subscribe(posts => {
      this.posts = posts;
      this.filteredPosts = posts;
      this.filter();
    });
  }

  filter(): void {
    const lowerCaseSearch = this.searching.toLowerCase().trim();

    this.filteredPosts = this.posts.filter(post => {
      const matchesSearch = 
        post.startingPoint.toLowerCase().includes(lowerCaseSearch) ||
        post.endPoint.toLowerCase().includes(lowerCaseSearch) ||
        post.title.toLowerCase().includes(lowerCaseSearch) ||
        post.user.username.toLowerCase().includes(lowerCaseSearch);
      
      const matchesTags = this.tags.length === 0 || this.tags.some(tag => post.tags.includes(tag));

      const isNotLoggedInUser = this.loggedUser ? post.user.id !== this.loggedUser.user.id : true;
      
      return matchesSearch && matchesTags && isNotLoggedInUser;
    });
  }

  getSelectedTags(event: any): void {
    const value = event.target.getAttribute('data-val');
    if (event.target.checked) {
      if (!this.tags.includes(value)) {
        this.tags.push(value);
      }
    } else {
      const index = this.tags.indexOf(value);
      if (index > -1) {
        this.tags.splice(index, 1);
      }
    }
    this.filter();
  }


 
}
