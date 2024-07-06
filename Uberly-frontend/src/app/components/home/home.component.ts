import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthData } from 'src/app/interfaces/auth-data';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/interfaces/post';
import { forkJoin, Observable, switchMap, tap } from 'rxjs';

import gsap from 'gsap';

import { NgForm } from '@angular/forms';
import { Tags } from 'src/app/interfaces/tags';
import { MemeService } from 'src/app/services/meme.service';
import { CommentService } from 'src/app/services/comment.service';
import { Comment } from '../../interfaces/comment';
import { Reply } from '@app/interfaces/reply';
import { ReplyService } from '@app/services/reply.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  loggedUser!: AuthData | null;
  user!: User | undefined;
  followingUsers: User[] = [];
  userId: number | undefined;
  following!: number;
  followers!: number;
  tags: Tags[] = [];
  uploadedImage: File | null = null;
  imagePreview: string | null = null;
  fileUpload: any;
  recentPosts: Post[] = [];
  repliesByComment: { [commentId: number]: Reply[] } = {};
  commentsByPost: { [postId: number]: Comment[] } = {};

  @ViewChild('slider', { static: true }) sliderRef!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('preview') preview!: ElementRef;
  @ViewChild('commentsSection', { static: false }) commentsSection!: ElementRef;

  constructor(
    private authSrv: AuthService,
    private userService: UserService,
    private postService: PostService,
    private memeService: MemeService,
    private commentService: CommentService,
    private replyService: ReplyService
  ) {}

  
  ngOnInit(): void {
    this.authSrv.user$.subscribe((user) => {
      this.loggedUser = user;
      if (this.loggedUser) {
        this.userService.getUser(this.loggedUser.user.id).subscribe((profileUser) => {
          this.user = profileUser;
          this.initializeUserDetails();
        });
      }
    });
    this.showLoader();
  }
  
  initializeUserDetails(): void {
    setTimeout(() => {
      if (this.user) {
        this.followers = this.extractNumber(this.user.followers);
        this.following = this.extractNumber(this.user.following);
        this.userId = this.user.id;
        this.loadFollowingUsers();
  
        this.postService.recentPostsSub.subscribe((recentPosts) => {
          this.recentPosts = recentPosts;
           this.initializeCommentsForPosts();
          this.initializeRepliesForComments();
        });
  
        this.postService.getRecentPostsForFollowedUsers(this.userId);
  
        this.hideLoader();
      }
    }, 1700);
  }


  initializeCommentsForPosts(): void {
    const commentObservables: Observable<Comment[]>[] = [];
  
    this.recentPosts.forEach((post) => {
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
  

  initializeRepliesForComments(): void {
    const replyObservables: Observable<Reply[]>[] = [];
  
    this.recentPosts.forEach((post) => {
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
      this.createPost();
      this.createMeme();
      const scrollbreakingnews = new ScrollingNews({
        el: '.slider',
        wrap: '.slider-wrapper',
        item: '.slider-item',
        bar: '.slider-progress-bar',
      });

      this.animateScroll(scrollbreakingnews);
    }, 1900);
  }

  showLoader(): void {
    const body: HTMLElement | null = document.querySelector('.body');
    if (body) {
      body.style.opacity = '0';
    }

    window.scrollTo(0, 0);

    const loader = document.querySelector('#loader');
    if (loader) {
      loader.classList.remove('hidden');
    }
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

  onSubmitComment(postId: number, form: NgForm) {
    form.value.userId = this.loggedUser?.user.id;
    form.value.postId = postId;

    this.commentService.createComment(form.value).subscribe(
      () => {
        console.log('comment sent!');
        form.reset();

        const postIndex = this.recentPosts.findIndex(
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

            const postIndex = this.recentPosts.findIndex(
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

  onSubmit(form: NgForm) {
    form.value.userId = this.userId;
    form.value.tags = this.tags;
  
    console.log(form.value); 
  
    this.postService.savePost(form.value).subscribe(
      () => {
        form.resetForm();
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
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onSubmitMeme(form: NgForm) {
    if (!this.uploadedImage) {
      console.error('No image uploaded');
      return;
    }
    form.value.userId = this.userId;
    form.value.tag = Tags.MEMES;

    this.memeService
      .saveMeme(form.value.userId, this.uploadedImage)
      .subscribe(() => {
        form.resetForm();
        this.clearImage();
        const postToggle = document.querySelectorAll('.preview-container');
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
      });
  }

  getSelectedTags(event: any) {
    const value = event.target.getAttribute('data-val');
    if (event.target.checked) {
      if (!this.tags.includes(value)) {
        this.tags.push(value);
      }
    } else {
      const index = this.tags.indexOf(value);
      if (index > -1) {
        this.tags.splice(index, 1);
      }
    }
  }

  loadFollowingUsers(): void {
    if (this.userId !== undefined) {
      this.userService.getFollowingUsers(this.userId).subscribe(
        (users: User[]) => {
          this.followingUsers = users;
        },
        (error: any) => {
          console.error('Error fetching following users', error);
        }
      );
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
    const post = this.recentPosts.find((p) => p.id === postId);
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
            const index = post.usersWhoSaved.findIndex((u) => u.id === loggedUser.user.id);
            if (index !== -1) {
              post.usersWhoSaved.splice(index, 1);
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
  
  isPostSaved(postId: number, user: AuthData): boolean {
    const post = this.recentPosts.find((p) => p.id === postId);
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

  animateScroll(scroll: ScrollingNews) {
    requestAnimationFrame(() => this.animateScroll(scroll));
    scroll.raf();
  }

  createPost(): void {
    const postToggle = document.querySelectorAll('.post-toggle');

    postToggle.forEach((button) => {
      button.addEventListener('click', () => {
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

  createMeme() {
    const postToggle = document.querySelectorAll('.meme-toggle');

    postToggle.forEach((button) => {
      button.addEventListener('click', () => {
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
      maxHeight: '100vh',
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
      this.uploadedImage = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        containerInput?.classList.add('hidden');
      };
      reader.readAsDataURL(file);
    }
  }

  clearImage(): void {
    this.uploadedImage = null;
    this.imagePreview = null;
    (document.querySelector('input[type="file"]') as HTMLInputElement).value =
      '';
    const containerInput = document.querySelector('.preview-container');
    containerInput?.classList.remove('hidden');
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

/* CLASS CREATED FOR THE SCROLLING NEWS */
class ScrollingNews {
  el: HTMLElement;
  wrap: HTMLElement;
  items: NodeListOf<HTMLElement>;
  bar: HTMLElement;
  progress: number = 0;
  speed: number = 0;
  oldX: number = 0;
  x: number = 0;
  playrate: number = 0;
  dragging: boolean = false;
  startX: number = 0;
  wrapWidth: number = 0;
  maxScroll: number = 0;
  scale: number = 1;
  breakingNewsBody: HTMLElement | null;

  constructor(obj: { el: string; wrap: string; item: string; bar: string }) {
    this.el = document.querySelector(obj.el) as HTMLElement;
    this.wrap = document.querySelector(obj.wrap) as HTMLElement;
    this.items = document.querySelectorAll(obj.item) as NodeListOf<HTMLElement>;
    this.bar = document.querySelector(obj.bar) as HTMLElement;
    this.breakingNewsBody = document.querySelector('.breaking-news-body');
    this.init();
  }

  lerp(f0: number, f1: number, t: number) {
    return (1 - t) * f0 + t * f1;
  }

  clamp(val: number, min: number, max: number) {
    return Math.max(min, Math.min(val, max));
  }

  init() {
    this.progress = 0;
    this.speed = 0;
    this.oldX = 0;
    this.x = 0;
    this.playrate = 0;

    this.bindings();
    this.events();
    this.calculate();
    this.raf();
  }

  bindings() {
    const methods = [
      'events',
      'calculate',
      'raf',
      'handleWheel',
      'move',
    ] as const;

    methods.forEach((method) => {
      (this[method] as unknown as Function) = this[method].bind(this);
    });
  }

  calculate() {
    this.progress = 0;
    this.wrapWidth = this.items[0].clientWidth * this.items.length;
    this.wrap.style.width = `${this.wrapWidth}px`;
    this.maxScroll = this.wrapWidth - this.el.clientWidth;
  }

  handleWheel(e: WheelEvent) {
    if (
      e.target === this.breakingNewsBody ||
      this.breakingNewsBody?.contains(e.target as Node)
    ) {
      e.preventDefault();
      this.progress += e.deltaY;
      this.move();
    }
  }

  move() {
    this.progress = this.clamp(this.progress, 0, this.maxScroll);
  }

  events() {
    if (this.breakingNewsBody) {
      this.breakingNewsBody.addEventListener('resize', this.calculate);
      this.breakingNewsBody.addEventListener('wheel', this.handleWheel);
    }
  }

  raf() {
    this.x = this.lerp(this.x, this.progress, 0.1);
    this.playrate = this.x / this.maxScroll;

    this.wrap.style.transform = `translateX(${-this.x}px)`;
    this.bar.style.transform = `scale(${0.18 + this.playrate * 0.82})`;

    this.speed = Math.min(100, this.oldX - this.x);
    this.oldX = this.x;
    this.scale = this.lerp(this.scale, this.speed, 0.1);
    this.items.forEach((item) => {
      item.style.transform = `scale(${1 - Math.abs(this.speed * 0.005)})`;
      const img = item.querySelector('img');
      if (img) {
        img.style.transform = `scaleX(${1 + Math.abs(this.speed * 0.004)})`;
      }
    });
  }
}
