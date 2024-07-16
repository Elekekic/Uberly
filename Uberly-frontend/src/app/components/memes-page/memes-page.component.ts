import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '@app/auth/auth.service';
import { AuthData } from '@app/interfaces/auth-data';
import { Meme } from '@app/interfaces/meme';
import { Reply } from '@app/interfaces/reply';
import { CommentService } from '@app/services/comment.service';
import { MemeService } from '@app/services/meme.service';
import { ReplyService } from '@app/services/reply.service';
import { UserService } from '@app/services/user.service';
import { forkJoin, Observable, tap } from 'rxjs';

import gsap from 'gsap';
import { Comment } from '@app/interfaces/comment';

@Component({
  selector: 'app-memes-page',
  templateUrl: './memes-page.component.html',
  styleUrls: ['./memes-page.component.scss']
})
export class MemesPageComponent implements OnInit {

  posts: Meme[] = [];
  filteredPosts: Meme[] = [];
  searching: string = '';
  loggedUser!: AuthData | null; 
  repliesByComment: { [commentId: number]: Reply[] } = {};
  commentsByPost: { [memeId: number]: Comment[] } = {};

  constructor(
    private memeService: MemeService,
    private authService: AuthService,
    private userService: UserService,
    private commentService: CommentService,
    private replyService: ReplyService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => (this.loggedUser = user));
    this.loadAllPosts();
    this.showLoader();
  }

  loadAllPosts(): void {
    this.memeService.getAllMemes().subscribe((posts) => {
      this.posts = posts;
      this.filteredPosts = posts;
      this.initializeCommentsForPosts();
      this.filter();
      this.hideLoader();
    });
  }

  filter(): void {
    const lowerCaseSearch = this.searching.toLowerCase().trim();

    this.filteredPosts = this.posts.filter(post => {
      const matchesSearch = 
        post.user.username.toLowerCase().includes(lowerCaseSearch) ||
        post.user.name.toLowerCase().includes(lowerCaseSearch) ||
        post.user.surname.toLowerCase().includes(lowerCaseSearch);
      const isNotLoggedInUser = this.loggedUser ? post.user.id !== this.loggedUser.user.id : true;

      return matchesSearch && isNotLoggedInUser;
    });
  }

  
  initializeCommentsForPosts(): void {
    const commentObservables: Observable<Comment[]>[] = [];
  
    // Check if recentPosts has posts inside the array
    if (this.posts && this.posts.length > 0) {
      this.posts.forEach((post) => {
        commentObservables.push(
          this.commentService.getCommentsByMemeId(post.id).pipe(
            tap((comments) => {
              this.commentsByPost[post.id] = comments || [];
            })
          )
        );
      });
  
      forkJoin(commentObservables).subscribe(
        () => {
          this.initializeRepliesForComments(); // Proceed to initialize all the replies 
        },
        (error) => {
          console.error('Error initializing comments: ', error);
        }
      );
    } else {
      // If recentPosts is empty or undefined, proceed without fetching comments so it can finish loading 
      this.initializeRepliesForComments();
    }
  }

  initializeRepliesForComments(): void {
    const replyObservables: Observable<Reply[]>[] = [];
  
    // Ensure recentPosts and commentsByPost are defined
    if (this.posts && this.commentsByPost) {
      this.posts.forEach((post) => {
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
  
      // Check if replyObservables has data inside the array 
      if (replyObservables.length > 0) {
        forkJoin(replyObservables).subscribe(
          () => {
            this.finalizeInitialization();
          },
          (error) => {
            console.error('Error initializing replies: ', error);
          }
        );
      } else {
        // if there's no replies, let the finalization complete with an empty array 
        this.finalizeInitialization();
      }
    } else {
      // if there aren't posts or comments, let the finalization complete with an empty array 
      this.finalizeInitialization();
    }
  }

  // search for all the toggles in the home page and hide the loader once everything is done 
  finalizeInitialization(): void {
    this.initializeComments();
    this.initializeReplies();
    this.initializeSaveButtons();
    this.hideLoader();
    setTimeout(() => {
      // i had to add a little bit of delay for the menus because if not, it wouldn't collect them all 
      this.initializeMenu();
    }, 500)
  }

  showLoader(): void {
    window.scrollTo(0, 0);
  }

  hideLoader(): void {
    const loader = document.querySelector('#loader');
    if (loader) {
      gsap.to(loader, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          loader.classList.add('hidden');
        },
      });
    }

    const body: HTMLElement | null = document.querySelector('.body');
    if (body) {
      body.style.opacity = '0';
      gsap.to(body, { opacity: 1, duration: 1 });
    }
  }

  onSubmitComment(memeId: number, form: NgForm) {
    form.value.userId = this.loggedUser?.user.id;
    form.value.memeId = memeId;

    this.commentService.createComment(form.value).subscribe(
      () => {
        form.reset();

        const postIndex = this.posts.findIndex(
          (post) => post.id === memeId
        );
        if (postIndex !== -1) {
          this.commentService
            .getCommentsByMemeId(memeId)
            .subscribe((comments) => {
              this.commentsByPost[memeId] = comments;
              setTimeout(() => {
                this.initializeCommentsMenu();
                this.initializeReplies();
                this.initializeRepliesMenu();
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
      () => {
        form.reset();

        this.replyService
          .getRepliesByCommentId(commentId)
          .subscribe((replies) => {
            this.repliesByComment[commentId] = replies;

            const postIndex = this.posts.findIndex(
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
              this.initializeRepliesMenu();
            }, 0);
          });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  initializeRepliesMenu() {
    const repliesToggles = document.querySelectorAll('.replies-toggle-menu');
    repliesToggles.forEach((button) => {
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

  initializeCommentsMenu() {
    const commentsToggles = document.querySelectorAll('.comment-toggle-menu');
    commentsToggles.forEach((button) => {
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

  initializeMenu() {
    const menuToggles = document.querySelectorAll('.three-dots');
    menuToggles.forEach((button) => {
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

  initializeSaveButtons() {
    const saveToggleButtons = document.querySelectorAll('.save-toggle');
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
    const post = this.posts.find((p) => p.id === postId);
    const loggedUser = this.loggedUser;

    if (loggedUser) {
      if (post && !this.isPostSaved(postId, loggedUser)) {
        this.userService.addSavedMeme(loggedUser.user.id, postId).subscribe(
          () => {
            post.usersWhoSaved.push(loggedUser.user);
            this.toggleSaveIconClass(button, true);
            console.log('Picture saved');
          },
          (err) => {
            console.error('Error saving post:', err);
          }
        );
      } else if (post && this.isPostSaved(post.id, loggedUser)) {
        this.userService.deleteSavedMeme(loggedUser.user.id, postId).subscribe(
          () => {
            const index = post.usersWhoSaved.findIndex(
              (u) => u.id === loggedUser.user.id
            );
            if (index !== -1) {
              post.usersWhoSaved.splice(index, 1);
            }
            this.toggleSaveIconClass(button, false);
            console.log('Picture removed from saved');
          },
          (err) => {
            console.error('Error removing post:', err);
          }
        );
      }
    }
  }

  isPostSaved(postId: number, user: AuthData): boolean {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) {
      return false;
    }
    return post.usersWhoSaved.some((u) => u.id === user.user.id);
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
    this.memeService.deleteMeme(postId).subscribe(() => {
      console.log('deleted post!');
    });
  }
}
