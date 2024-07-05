import {
  AfterViewInit,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { AuthData } from '@app/interfaces/auth-data';
import { Comment } from '@app/interfaces/comment';
import { Post } from '@app/interfaces/post';
import { Reply } from '@app/interfaces/reply';
import { User } from '@app/interfaces/user';
import { CommentService } from '@app/services/comment.service';
import { PostService } from '@app/services/post.service';
import { ReplyService } from '@app/services/reply.service';
import { UserService } from '@app/services/user.service';

import gsap from 'gsap';
import { forkJoin, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit, AfterViewInit {
  postsUser: Post[] = [];
  repliesByComment: { [commentId: number]: Reply[] } = {};
  commentsByPost: { [postId: number]: Comment[] } = {};
  following!: number;
  followers!: number;
  loggedUser!: AuthData | null;
  user!: User;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private authService: AuthService,
    private userService: UserService,
    private commentService: CommentService,
    private replyService: ReplyService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => (this.loggedUser = user));

    const parentRoute = this.route.parent;
    if (parentRoute) {
      parentRoute.params.subscribe((parentParams) => {
        const id = +parentParams['id'];

        this.userService.getUser(id).subscribe((profileUser) => {
          this.user = profileUser;
          this.postService.refreshPostsByUser(id);
        });

        this.postService.postsByUserSub.subscribe((posts) => {
          this.postsUser = posts;
          this.initializeCommentsForPosts();
          this.initializeRepliesForComments();
        });
      });
    }
  }

  initializeCommentsForPosts(): void {
    const commentObservables: Observable<Comment[]>[] = [];

    this.postsUser.forEach((post) => {
      commentObservables.push(
        this.commentService.getCommentsByPostId(post.id).pipe(
          tap((comments) => {
            if (comments !== null) {
              this.commentsByPost[post.id] = comments;
            } else {
              this.commentsByPost[post.id] = [];
            }
            console.log(`Comments for post ${post.id}:`, this.commentsByPost[post.id]);
          })
        )
      );
    });

    forkJoin(commentObservables).subscribe(() => {
      console.log('All comments fetched: ', this.commentsByPost);
      this.initializeRepliesForComments();
    });
  }

  initializeRepliesForComments(): void {
    const replyObservables: Observable<Reply[]>[] = [];

    this.postsUser.forEach((post) => {
      const comments = this.commentsByPost[post.id] || [];
      comments.forEach((comment) => {
        replyObservables.push(
          this.replyService.getRepliesByCommentId(comment.id).pipe(
            tap((replies) => {
              if (replies !== null) {
                this.repliesByComment[comment.id] = replies;
              } else {
                this.repliesByComment[comment.id] = [];
              }
              console.log(
                `Replies for comment ${comment.id}:`,
                this.repliesByComment[comment.id]
              );
            })
          )
        );
      });
    });

    forkJoin(replyObservables).subscribe(() => {
      console.log('All replies fetched: ', this.repliesByComment);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeComments();
      this.initializeReplies();
      this.initializeMenu();
    }, 200);
  }

  onSubmitComment(postId: number, form: NgForm) {
    form.value.userId = this.loggedUser?.user.id;
    form.value.postId = postId;
  
    this.commentService.createComment(form.value).subscribe(
      () => {
        console.log('comment sent!');
        form.reset();
  
        const postIndex = this.postsUser.findIndex((post) => post.id === postId);
        if (postIndex !== -1) {
          this.commentService.getCommentsByPostId(postId).subscribe((comments) => {
            this.commentsByPost[postId] = comments;
            setTimeout(() => {
              this.initializeMenu();
              this.initializeReplies();
            }, 0);
          });
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
  
  onSubmitReply(postId: number, commentId: number, form: NgForm) {
    form.value.userId = this.loggedUser?.user.id;
    form.value.commentId = commentId;
  
    this.replyService.createReply(form.value).subscribe(
      (response) => {
        console.log('reply sent!', response);
        form.reset();
  
        this.replyService.getRepliesByCommentId(commentId).subscribe((replies) => {
          this.repliesByComment[commentId] = replies;
  
          const postIndex = this.postsUser.findIndex((post) => post.id === postId);
          if (postIndex !== -1) {
            const commentIndex = this.commentsByPost[postId].findIndex((comment) => comment.id === commentId);
            if (commentIndex !== -1) {
              this.commentsByPost[postId][commentIndex].replies = replies;
            }
          }
  
          setTimeout(() => {
            this.initializeMenu();
          }, 0);
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  initializeMenu() {
    const menuToggles = document.querySelectorAll('.three-dots');
    console.log('all the menus: ', menuToggles);
    menuToggles.forEach((button) => {
      button.addEventListener('click', () => {
        console.log('button clicked', button);
        const targetSelector = button.getAttribute('data-target');
        if (targetSelector) {
          const target = document.querySelector(targetSelector) as HTMLElement;
          if (target) {
            const isOpen = !target.classList.contains('close');
            if (isOpen) {
              this.close(target);
            } else {
              this.open(target);
            }
          }
        }
      });
    });
  }

  initializeComments() {
    const commentToggle = document.querySelectorAll('.comments-toggle');
    commentToggle.forEach((button) => {
      button.addEventListener('click', () => {
        const targetSelector = button.getAttribute('data-target');
        if (targetSelector) {
          const target = document.querySelector(targetSelector) as HTMLElement;
          if (target) {
            const isOpen = !target.classList.contains('close');
            if (isOpen) {
              this.close(target);
            } else {
              this.open(target);
            }
          }
        }
      });
    });
  }

  initializeReplies() {
    const repliesToggle = document.querySelectorAll('.replies-toggle');
    console.log(repliesToggle);
    repliesToggle.forEach((button) => {
      button.addEventListener('click', () => {
        const targetSelector = button.getAttribute('data-target');
        if (targetSelector) {
          const target = document.querySelector(targetSelector) as HTMLElement;
          if (target) {
            const isOpen = !target.classList.contains('close');
            if (isOpen) {
              this.close(target);
            } else {
              this.open(target);
            }
          }
        }
      });
    });
  }

  

  open(target: HTMLElement) {
    target.classList.remove('close');
    gsap.fromTo(
      target,
      { opacity: 0, height: 0 },
      { opacity: 1, height: 'auto', duration: 0.7, ease: 'power3.inOut' }
    );
  }

  close(target: HTMLElement) {
    gsap.to(target, {
      opacity: 0,
      height: 0,
      duration: 0.7,
      ease: 'power3.inOut',
      onComplete: () => {
        target.classList.add('close');
      },
    });
  }

  onDelete(commentId: number) {
    this.commentService.deleteComment(commentId).subscribe(() => {
      console.log('comment deleted!');
    });
  }

  onDeleteReply(replyId: number) {
    this.replyService.deleteReply(replyId).subscribe(() => {
      console.log('reply deleted!');
    });
  }

  onDeletePost(postId: number) {
    this.postService.deletePost(postId).subscribe(
      () => {
        console.log('deleted post!'); 
      }
    )
  }
}
