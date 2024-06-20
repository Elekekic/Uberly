import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Route, RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { CommunityComponent } from './components/community/community.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FeedbacksComponent } from './components/feedbacks/feedbacks.component';
import { SavedPostsComponent } from './components/saved-posts/saved-posts.component';
import { SavedMemesComponent } from './components/saved-memes/saved-memes.component';
import { FollowingComponent } from './components/following/following.component';
import { FollowersComponent } from './components/followers/followers.component';
import { ForYouPageComponent } from './components/for-you-page/for-you-page.component';
import { ExplorePageComponent } from './components/explore-page/explore-page.component';
import { MemesPageComponent } from './components/memes-page/memes-page.component';
import { AuthService } from './auth/auth.service';
import { TokenInterceptor } from './auth/token.interceptor';

const routes: Route[] = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: 'explore',
        component: ExplorePageComponent,
      },
      {
        path: 'for-you',
        component: ForYouPageComponent,
      },
      {
        path: 'memes',
        component: MemesPageComponent,
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignUpComponent,
  },
  {
    path: 'community',
    component: CommunityComponent,
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
    children: [
      {
        path: 'feedbacks',
        component: FeedbacksComponent,
      },
      {
        path: 'favorites',
        component: SavedPostsComponent,
      },
      {
        path: 'favorite-memes',
        component: SavedMemesComponent,
      },
      {
        path: 'following',
        component: FollowingComponent,
      },
      {
        path: 'followers',
        component: FollowersComponent,
      }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    LandingPageComponent,
    NavbarComponent,
    HomeComponent,
    CommunityComponent,
    ProfileComponent,
    FeedbacksComponent,
    SavedPostsComponent,
    SavedMemesComponent,
    FollowingComponent,
    FollowersComponent,
    ForYouPageComponent,
    ExplorePageComponent,
    MemesPageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule, 
    FormsModule, 
    RouterModule.forRoot(routes),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
