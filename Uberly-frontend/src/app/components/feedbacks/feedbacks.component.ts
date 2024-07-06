import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { AuthData } from '@app/interfaces/auth-data';
import { Feedbacks } from '@app/interfaces/feedbacks';
import { User } from '@app/interfaces/user';
import { FeedbackService } from '@app/services/feedback.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.scss'],
})
export class FeedbacksComponent {
  user!: User | undefined;
  loggedUser!: AuthData | null;
  authoredFeedbacks: Feedbacks[] = [];
  receivedFeedbacks: Feedbacks[] = [];
  updatingFeedbackId: number | null = null;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private feedbackService: FeedbackService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.loggedUser = user;
    });

    const parentRoute = this.route.parent;
    if (parentRoute) {
      parentRoute.params.subscribe((parentParams) => {
        const id = +parentParams['id'];

        this.userService.getUser(id).subscribe((data) => {
          this.user = data;

          this.feedbackService.refreshFeedbacksByAuthor(id);
          this.feedbackService.refreshFeedbacksByRecipient(id);

          this.feedbackService.feedbacksRecipientSub.subscribe((feedbacks) => {
            this.receivedFeedbacks = feedbacks;
          });

          this.feedbackService.feedbacksAuthorSub.subscribe((feedbacks) => {
            this.authoredFeedbacks = feedbacks;
          });
        });
      });
    }
  }

  onSubmit(form: NgForm) {
    form.value.authorId = this.loggedUser?.user.id;
    form.value.recipientId = this.user?.id;

    this.feedbackService.createFeedback(form.value).subscribe(
      (newFeedback) => {
        console.log('Feedback sent!');
        form.reset();

        this.receivedFeedbacks.push(newFeedback);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onDelete(feedbackId: number) {
    this.feedbackService.deleteFeedback(feedbackId).subscribe(() => {
      console.log('Feedback deleted');
      
      this.receivedFeedbacks = this.receivedFeedbacks.filter(feedback => feedback.id !== feedbackId);
      
      this.authoredFeedbacks = this.authoredFeedbacks.filter(feedback => feedback.id !== feedbackId);
    },
    (error) => {
      console.error('Error deleting feedback:', error);
    });
  }

  showUpdateForm(feedbackId: number) {
    this.updatingFeedbackId = feedbackId;
  }

  onUpdate(feedbackId: number, form: NgForm) {
    this.feedbackService
      .updateFeedback(feedbackId, form.value)
      .subscribe(() => {
        console.log('feedback updated');
        this.updatingFeedbackId = null;
      });
  }
}
