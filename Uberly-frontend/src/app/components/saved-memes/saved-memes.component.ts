import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@app/interfaces/user';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-saved-memes',
  templateUrl: './saved-memes.component.html',
  styleUrls: ['./saved-memes.component.scss']
})
export class SavedMemesComponent {
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
