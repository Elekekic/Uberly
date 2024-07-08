import { AfterViewInit, Component, OnInit } from '@angular/core';
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
import { forkJoin, Observable, tap } from 'rxjs';

import gsap from 'gsap';

@Component({
  selector: 'app-saved-posts',
  templateUrl: './saved-posts.component.html',
  styleUrls: ['./saved-posts.component.scss'],
})
export class SavedPostsComponent implements OnInit, AfterViewInit {
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
    this.initializeUserPosts();

    const parentRoute = this.route.parent;
    if (parentRoute) {
      parentRoute.params.subscribe((parentParams) => {
        const id = +parentParams['id'];

        this.userService.getUser(id).subscribe((profileUser) => {
          this.user = profileUser;
          this.postService.refreshPostsByUser(id);
          this.userService.getSavedPostsByUserId(id).subscribe();
        });
      });
    }
  }

  initializeUserPosts(): void {
    setTimeout(() => {
      this.userService.favPostsByUserSub.subscribe((posts) => {
        this.postsUser = posts;
        this.initializeCommentsForPosts();
        this.initializeRepliesForComments();
      });
    }, 1000);
  }

  initializeCommentsForPosts(): void {
    const commentObservables: Observable<Comment[]>[] = [];

    this.postsUser.forEach((post) => {
      commentObservables.push(
        this.commentService.getCommentsByPostId(post.id).pipe(
          tap((comments) => {
            this.commentsByPost[post.id] = comments || [];
          })
        )
      );
    });

    forkJoin(commentObservables).subscribe(
      () => {
        console.log('Comments initialized');
      },
      (error) => {
        console.error('Error initializing comments: ', error);
      }
    );
  }

  initializeCommentsAndReplies(): void {
    const commentObservables: Observable<Comment[]>[] = [];
    const replyObservables: Observable<Reply[]>[] = [];

    this.postsUser.forEach((post) => {
      commentObservables.push(
        this.commentService.getCommentsByPostId(post.id).pipe(
          tap((comments) => {
            this.commentsByPost[post.id] = comments || [];
          })
        )
      );
    });

    forkJoin(commentObservables).subscribe(
      () => {
        console.log('Comments initialized');
        this.initializeRepliesForComments();
      },
      (error) => {
        console.error('Error initializing comments: ', error);
      }
    );
  }

  initializeRepliesForComments(): void {
    const replyObservables: Observable<Reply[]>[] = [];

    this.postsUser.forEach((post) => {
      const comments = this.commentsByPost[post.id] || [];
      comments.forEach((comment) => {
        replyObservables.push(
          this.replyService.getRepliesByCommentId(comment.id).pipe(
            tap((replies) => {
              this.repliesByComment[comment.id] = replies || [];
            })
          )
        );
      });
    });

    forkJoin(replyObservables).subscribe(
      () => {
        console.log('Replies initialized');
      },
      (error) => {
        console.error('Error initializing replies: ', error);
      }
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeComments();
      this.initializeReplies();
      this.initializeMenu();
      this.initializeSaveButtons();
    }, 1000);
  }

  onSubmitComment(postId: number, form: NgForm) {
    form.value.userId = this.loggedUser?.user.id;
    form.value.postId = postId;

    this.commentService.createComment(form.value).subscribe(
      () => {
        console.log('comment sent!');
        form.reset();

        const postIndex = this.postsUser.findIndex(
          (post) => post.id === postId
        );
        if (postIndex !== -1) {
          this.commentService
            .getCommentsByPostId(postId)
            .subscribe((comments) => {
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

        this.replyService
          .getRepliesByCommentId(commentId)
          .subscribe((replies) => {
            this.repliesByComment[commentId] = replies;

            const postIndex = this.postsUser.findIndex(
              (post) => post.id === postId
            );
            if (postIndex !== -1) {
              const commentIndex = this.commentsByPost[postId].findIndex(
                (comment) => comment.id === commentId
              );
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

  initializeSaveButtons() {
    const saveToggleButtons = document.querySelectorAll('.save-toggle');
    console.log(saveToggleButtons);
    saveToggleButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const postId = Number(button.getAttribute('data-post-id'));
        this.onSaves(postId, button);
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
              this.toggleChatIconClass(button, false);
            } else {
              this.open(target);
              this.toggleChatIconClass(button, true);
            }
          }
        }
      });
    });
  }

  toggleChatIconClass(button: Element, isOpen: boolean) {
    if (isOpen) {
      button.classList.remove('bi-chat');
      button.classList.add('bi-chat-fill');
    } else {
      button.classList.remove('bi-chat-fill');
      button.classList.add('bi-chat');
    }
  }

  onSaves(postId: number, button: Element) {
    const post = this.postsUser.find((p) => p.id === postId);
    const loggedUser = this.loggedUser;

    if (loggedUser) {
      if (post && !this.isPostSaved(postId, loggedUser)) {
        this.userService.addSavedPost(loggedUser.user.id, postId).subscribe(
          () => {
            post.usersWhoSaved.push(loggedUser.user);
            this.toggleSaveIconClass(button, true);
            console.log('Post saved');
          },
          (err) => {
            console.error('Error saving post:', err);
          }
        );
      } else if (post && this.isPostSaved(post.id, loggedUser)) {
        this.userService.deleteSavedPost(loggedUser.user.id, postId).subscribe(
          () => {
            const index = post.usersWhoSaved.findIndex(
              (u) => u.id === loggedUser.user.id
            );
            if (index !== -1) {
              post.usersWhoSaved.splice(index, 1);
            }
            this.toggleSaveIconClass(button, false);
            this.removePostFromSaved(postId);
            console.log('Post removed from saved');
          },
          (err) => {
            console.error('Error removing post:', err);
          }
        );
      }
    }
  }

  isPostSaved(postId: number, user: AuthData): boolean {
    const post = this.postsUser.find((p) => p.id === postId);
    if (!post) {
      return false;
    }
    return post.usersWhoSaved.some((u) => u.id === user.user.id);
  }

  removePostFromSaved(postId: number) {
    const index = this.postsUser.findIndex((p) => p.id === postId);
    if (index !== -1) {
      this.postsUser.splice(index, 1);
    }
  }

  toggleSaveIconClass(button: Element, isSaved: boolean) {
    if (isSaved) {
      button.classList.remove('bi-bookmark');
      button.classList.add('bi-bookmark-fill');
    } else {
      button.classList.remove('bi-bookmark-fill');
      button.classList.add('bi-bookmark');
    }
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
    this.postService.deletePost(postId).subscribe(() => {
      console.log('deleted post!');
    });
  }
}
