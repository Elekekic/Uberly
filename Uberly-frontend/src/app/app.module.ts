import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Route, RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { ForYouPageComponent } from './components/for-you-page/for-you-page.component';
import { ExplorePageComponent } from './components/explore-page/explore-page.component';
import { MemesPageComponent } from './components/memes-page/memes-page.component';
import { AuthService } from './auth/auth.service';
import { TokenInterceptor } from './auth/token.interceptor';
import { Error404Component } from './components/error-404/error-404.component';
import { SettingsComponent } from './components/settings/settings.component';
import { PostsComponent } from './components/posts/posts.component';
import { MemesComponent } from './components/memes/memes.component';
import { AuthGuard } from './auth/auth-.guard';
import { SearchComponent } from './components/search/search.component';

const routes: Route[] = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'explore-page',
    component: ExplorePageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full',
      },
      {
        path: 'search',
        component: SearchComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'for-you',
        component: ForYouPageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'pictures',
        component: MemesPageComponent,
        canActivate: [AuthGuard]
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
    canActivate: [AuthGuard],
    children: [
      { path: 'feedbacks', component: FeedbacksComponent, canActivate: [AuthGuard] },
      { path: 'saved-posts', component: SavedPostsComponent, canActivate: [AuthGuard] },
      { path: 'saved-memes', component: SavedMemesComponent, canActivate: [AuthGuard]  },
      { path: 'posts', component: PostsComponent, canActivate: [AuthGuard]  },
      { path: 'pictures', component: MemesComponent, canActivate: [AuthGuard]  }
    ]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: Error404Component,
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
    ForYouPageComponent,
    ExplorePageComponent,
    MemesPageComponent,
    Error404Component,
    SettingsComponent,
    PostsComponent,
    MemesComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule, 
    ReactiveFormsModule,
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
