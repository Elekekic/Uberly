import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@app/interfaces/user';
import { PostService } from '@app/services/post.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-saved-posts',
  templateUrl: './saved-posts.component.html',
  styleUrls: ['./saved-posts.component.scss'],
})
export class SavedPostsComponent {
  user!: User;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const parentRoute = this.route.parent;
    if (parentRoute) {
      parentRoute.params.subscribe((parentParams) => {
        const id = +parentParams['id'];

        this.userService.getUser(id).subscribe((data) => {
          this.user = data;
        });
      });
    }
  }
}
