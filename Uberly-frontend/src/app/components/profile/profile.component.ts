import { Component } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthData } from '@app/interfaces/auth-data';
import { AuthService } from '@app/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  user!: User;
  following!: number;
  followers!: number;
  loggedUser!: AuthData | null;
  loggedFollowing: User[] = [];
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private route: Router,
    private router: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.authService.user$.subscribe((user) => (this.loggedUser = user));
    this.router.params.subscribe(async (params) => {
      const id = +params['id'];
      setTimeout(async () => {
        this.userService.getUser(id).subscribe((profileUser) => {
          this.user = profileUser;
          
          this.followers = this.extractNumber(this.user.followers);
          this.following = this.extractNumber(this.user.following);
        });
        this.loadLoggedFollowing();
      }, 500);
    });
  }

  loadLoggedFollowing() {
    if (this.loggedUser) {
      this.userService.getFollowingUsers(this.loggedUser.user.id).subscribe(following => {
        this.loggedFollowing = following; 
      });
    }
  }


  private extractNumber(value: User[] | number | undefined): number {
    if (typeof value === 'number') {
      return value;
    } else if (Array.isArray(value)) {
      return value.length;
    } else {
      return 0;
    }
  }

  navigateTo(path: string): void {
    const userId = this.router.snapshot.paramMap.get('id');
    this.route.navigate([`/profile/${userId}/${path}`]);
  }

  follow(userId: number) {
    if (this.loggedUser?.user.id) {
      this.userService.followUser(this.loggedUser?.user.id, userId).subscribe(
        () => {
          console.log("followed the user");
          this.loadLoggedFollowing(); 
          this.followers++; 
        }
      );
    }
  }
  
  unfollow(userId: number) {
    if (this.loggedUser?.user.id) {
      this.userService.unfollowUser(this.loggedUser?.user.id, userId).subscribe(
        () => {
          console.log("unfollowed the user");
          this.loadLoggedFollowing(); 
          this.followers--; 
        }
      );
    }
  }

  shouldShowFollowButton(userId: number): boolean {
    return this.loggedFollowing.some(following => following.id === userId);
  }
}
