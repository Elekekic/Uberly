import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { AuthData } from '@app/interfaces/auth-data';
import { User } from '@app/interfaces/user';
import { CommentService } from '@app/services/comment.service';
import { UserService } from '@app/services/user.service';

import gsap from 'gsap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  loggedUser!: AuthData | null;
  pictureProfile: File | null = null;
  imagePreview: string | null = null;
  selectedRole: string = '';
  user!: User;
  private userSubscription!: Subscription;

  constructor(
    private authSrv: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.OnUpdatePfp();
    }, 1000);
  }

  ngOnInit(): void {
    this.authSrv.user$.subscribe((user) => {
      this.loggedUser = user;
    });
    if (this.loggedUser) {
      this.userService
        .getUser(this.loggedUser.user.id)
        .subscribe((profileUser) => {
          this.user = profileUser;
        });
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  Ondelete(userId: number | undefined) {
    if (userId !== undefined) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          this.authSrv.clearUser(); 
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Error deleting user', error);
        }
      );
    } else {
      console.error('User ID is undefined');
    }
  }


  onSubmitMeme(form: NgForm): void {
    if (!this.pictureProfile) {
      console.error('No image uploaded');
      return;
    }

    const userId = this.loggedUser?.user?.id;
    if (!userId) {
      console.error('User ID is undefined');
      return;
    }

    this.userService
      .patchPictureProfile(userId, this.pictureProfile)
      .subscribe({
        next: (response: any) => {
          if (response.newPictureUrl) {
            if (this.loggedUser && this.loggedUser.user) {
              this.loggedUser.user.pictureProfile = response.newPictureUrl;

              this.user.pictureProfile = response.newPictureUrl;
            } else {
              console.error('loggedUser or loggedUser.user is null');
            }
            form.resetForm();
            this.clearImage();
            console.log('Profile picture updated');
            const postToggle = document.querySelectorAll('.submit');
            postToggle.forEach((button) => {
              const targetSelector = button.getAttribute('data-target');
              if (targetSelector) {
                const target = document.querySelector(
                  targetSelector
                ) as HTMLElement;
                if (target) {
                  this.closeCreation(target);
                }
              }
            });
          }
        },
      });
  }

  OnUpdatePfp() {
    const postToggle = document.querySelectorAll('.update-toggle');
    console.log(postToggle);

    postToggle.forEach((button) => {
      button.addEventListener('click', () => {
        console.log('Button clicked');
        const targetSelector = button.getAttribute('data-target');
        if (targetSelector) {
          const target = document.querySelector(targetSelector) as HTMLElement;
          if (target) {
            const isOpen = target.classList.contains('open');
            if (isOpen) {
              this.closeCreation(target);
            } else {
              this.openCreation(target);
            }
          }
        }
      });
    });
  }

  openCreation(target: HTMLElement): void {
    gsap.to(target, {
      duration: 0.4,
      maxHeight: '50vh',
      opacity: 1,
      ease: 'power4.inOut',
      onComplete: () => {
        target.classList.add('open');
      },
    });
  }

  closeCreation(target: HTMLElement): void {
    gsap.to(target, {
      duration: 0.8,
      maxHeight: 0,
      opacity: 0,
      ease: 'power4.inOut',
      onComplete: () => {
        target.classList.remove('open');
      },
    });
  }

  handleFileInput(event: Event): void {
    const containerInput = document.querySelector('.preview-container');
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && file.type.startsWith('image/')) {
      this.pictureProfile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        containerInput?.classList.add('hidden');
      };
      reader.readAsDataURL(file);
    }
  }

  clearImage(): void {
    this.pictureProfile = null;
    this.imagePreview = null;
    (document.querySelector('input[type="file"]') as HTMLInputElement).value =
      '';
    const containerInput = document.querySelector('.preview-container');
    containerInput?.classList.remove('hidden');
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      form.value.role = this.selectedRole;
      if (this.loggedUser?.user.id) {
        this.userService
          .updateUser(this.loggedUser?.user.id, form.value)
          .subscribe(
            () => {
              console.log('Updated user');
            },
            (error) => {
              console.error('Error updating user:', error);
            }
          );
      } else {
        console.error('User ID is missing');
      }
    } else {
      console.error('Form is invalid');
    }
  }

  selectRole(event: any): void {
    this.selectedRole = event.target.getAttribute('data-val');
    console.log(this.selectedRole);
  }
}
