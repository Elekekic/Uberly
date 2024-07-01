import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { AuthData } from '@app/interfaces/auth-data';
import { Post } from '@app/interfaces/post';
import { User } from '@app/interfaces/user';
import { PostService } from '@app/services/post.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent {
  postsUser!: Post[];
  following!: number;
  followers!: number;
  loggedUser!: AuthData | null;
  user!: User;
  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => (this.loggedUser = user));
    const parentRoute = this.route.parent;
    if (parentRoute) {
      parentRoute.params.subscribe((parentParams) => {
        const id = +parentParams['id'];

        this.userService.getUser(id).subscribe((profileUser) => {
          this.user = profileUser;

          this.postService.getPostsByUser(id).subscribe((posts) => {
            this.postsUser = posts;
          });
        });
      });
    }
  }
}
