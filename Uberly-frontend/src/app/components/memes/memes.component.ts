import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { AuthData } from '@app/interfaces/auth-data';
import { Meme } from '@app/interfaces/meme';
import { User } from '@app/interfaces/user';
import { MemeService } from '@app/services/meme.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-memes',
  templateUrl: './memes.component.html',
  styleUrls: ['./memes.component.scss'],
})
export class MemesComponent {
  MemesUser!: Meme[];
  following!: number;
  followers!: number;
  loggedUser!: AuthData | null;
  user!: User;
  constructor(
    private route: ActivatedRoute,
    private memeService: MemeService,
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

          this.memeService.getAllMemesByUserId(id).subscribe((memes) => {
            this.MemesUser = memes;
          });
        });
      });
    }
  }
}
