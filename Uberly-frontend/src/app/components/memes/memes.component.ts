import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { AuthData } from '@app/interfaces/auth-data';
import { Comment } from '@app/interfaces/comment';
import { Meme } from '@app/interfaces/meme';
import { Reply } from '@app/interfaces/reply';
import { User } from '@app/interfaces/user';
import { CommentService } from '@app/services/comment.service';
import { MemeService } from '@app/services/meme.service';
import { ReplyService } from '@app/services/reply.service';
import { UserService } from '@app/services/user.service';
import { forkJoin, Observable, tap } from 'rxjs';

import gsap from 'gsap';

@Component({
  selector: 'app-memes',
  templateUrl: './memes.component.html',
  styleUrls: ['./memes.component.scss'],
})
export class MemesComponent implements OnInit, AfterViewInit {
  MemesUser!: Meme[];
  repliesByComment: { [commentId: number]: Reply[] } = {};
  commentsByMeme: { [memeId: number]: Comment[] } = {};
  following!: number;
  followers!: number;
  loggedUser!: AuthData | null;
  user!: User;
  
  constructor(
    private route: ActivatedRoute,
    private memeService: MemeService,
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
          this.memeService.refreshPostsByUser(id);

          this.memeService.getAllMemesByUserId(id).subscribe((memes) => {
            this.MemesUser = memes;
            this.initializeCommentsForPosts();
          this.initializeRepliesForComments();
          });
        });
      });
    }
  }

  initializeCommentsForPosts(): void {
    const commentObservables: Observable<Comment[]>[] = [];
  
    this.MemesUser.forEach((meme) => {
      commentObservables.push(
        this.commentService.getCommentsByMemeId(meme.id).pipe(
          tap((comments) => {
            this.commentsByMeme[meme.id] = comments || [];
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
  

 
  initializeRepliesForComments(): void {
    const replyObservables: Observable<Reply[]>[] = [];
  
    this.MemesUser.forEach((meme) => {
      const comments = this.commentsByMeme[meme.id] || [];
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
    }, 200);
  }

  onSubmitComment(memeId: number, form: NgForm) {
    form.value.userId = this.loggedUser?.user.id;
    form.value.memeId = memeId;

    this.commentService.createComment(form.value).subscribe(
      () => {
        console.log('comment sent!');
        form.reset();

        const memeIndex = this.MemesUser.findIndex(
          (meme) => meme.id === memeId
        );
        if (memeIndex !== -1) {
          this.commentService
            .getCommentsByMemeId(memeId)
            .subscribe((comments) => {
              this.commentsByMeme[memeId] = comments;
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

  onSubmitReply(memeId: number, commentId: number, form: NgForm) {
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

            const memeIndex = this.MemesUser.findIndex(
              (meme) => meme.id === memeId
            );
            if (memeIndex !== -1) {
              const commentIndex = this.commentsByMeme[memeId].findIndex(
                (comment) => comment.id === commentId
              );
              if (commentIndex !== -1) {
                this.commentsByMeme[memeId][commentIndex].replies = replies;
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
    console.log("Toggle save buttons", saveToggleButtons);
    saveToggleButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const postId = Number(button.getAttribute('data-meme-id'));
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

  onSaves(memeId: number, button: Element) {
    const meme = this.MemesUser.find((m) => m.id === memeId);
    const loggedUser = this.loggedUser;
  
    if (loggedUser) {
      if (meme && !this.isMemeSaved(memeId, loggedUser)) {
        this.userService.addSavedMeme(loggedUser.user.id, memeId).subscribe(
          () => {
            meme.usersWhoSaved.push(loggedUser.user);
            this.toggleSaveIconClass(button, true);
            console.log('Post saved');
          },
          (err) => {
            console.error('Error saving post:', err);
          }
        );
      } else if (meme && this.isMemeSaved(meme.id, loggedUser)) {
        this.userService.deleteSavedMeme(loggedUser.user.id, memeId).subscribe(
          () => {
            const index = meme.usersWhoSaved.findIndex((u) => u.id === loggedUser.user.id);
            if (index !== -1) {
              meme.usersWhoSaved.splice(index, 1);
            }
            this.toggleSaveIconClass(button, false);
            console.log('Post removed from saved');
          },
          (err) => {
            console.error('Error removing post:', err);
          }
        );
      }
    }
  }
  
  isMemeSaved(memeId: number, user: AuthData): boolean {
    const meme = this.MemesUser.find((m) => m.id === memeId);
    if (!meme) {
      return false;
    }
    return meme.usersWhoSaved.some((u) => u.id === user.user.id);
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

  onDeleteMeme(memeId: number) {
    this.memeService.deleteMeme(memeId).subscribe(() => {
      console.log('deleted post!');
    });
  }
}
