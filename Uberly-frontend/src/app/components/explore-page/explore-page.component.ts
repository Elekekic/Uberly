import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthData } from 'src/app/interfaces/auth-data';

@Component({
  selector: 'app-explore-page',
  templateUrl: './explore-page.component.html',
  styleUrls: ['./explore-page.component.scss']
})
export class ExplorePageComponent {

  user!: AuthData | null;

  constructor(private authSrv: AuthService,
  ) {}

  ngOnInit(): void {
    this.authSrv.user$.subscribe((user) => (this.user = user));
  }


}
