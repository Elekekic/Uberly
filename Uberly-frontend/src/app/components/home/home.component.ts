import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthData } from 'src/app/interfaces/auth-data';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/interfaces/post';
import { debounceTime, switchMap } from 'rxjs';

import gsap from 'gsap';

import { NgForm } from '@angular/forms';
import { Tags } from 'src/app/interfaces/tags';
import { MemeService } from 'src/app/services/meme.service';
import { ReactionService } from 'src/app/services/reaction.service';
import { Reaction } from 'src/app/interfaces/reaction';
import { Reactiontypes } from 'src/app/interfaces/reactiontypes';
import { CommentService } from 'src/app/services/comment.service';
import { Comment } from '../../interfaces/comment';
import { data } from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  user!: AuthData | null;
  allUsers!: User[];
  followingUsers: User[] = [];
  userId: number | undefined;
  following!: number;
  followers!: number;
  tags: Tags[] = [];
  uploadedImage: File | null = null;
  imagePreview: string | null = null;
  recentPosts: Record<string, Post[]> = {};
  fileUpload: any;
  allPosts!: Post[];
  allReactions!: Reaction[];
  recentComments: Comment[] = [];

  @ViewChild('slider', { static: true }) sliderRef!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('preview') preview!: ElementRef;
  @ViewChild('commentsSection', { static: false }) commentsSection!: ElementRef;

  constructor(
    private authSrv: AuthService,
    private userService: UserService,
    private postService: PostService,
    private memeService: MemeService,
    private reactionService: ReactionService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.authSrv.user$.subscribe((user) => {
      this.user = user;
    });
    this.showLoader();
    setTimeout(() => {
      this.followers = this.extractNumber(this.user?.user.followers);
      this.following = this.extractNumber(this.user?.user.following);
      this.userId = this.user?.user.id;
      this.loadFollowingUsers();
      this.postService.getAllPosts().subscribe((posts) => {
        this.allPosts = posts;
      });

      this.userService.getUsers().subscribe((users) => {
        this.allUsers = users;
      });

      this.reactionService.getAllReactions().subscribe((reactions) => {
        this.allReactions = reactions;
      });
      this.hideLoader();
    }, 1700);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createPost();
      this.createMeme();
      const scrollbreakingnews = new ScrollingNews({
        el: '.slider',
        wrap: '.slider-wrapper',
        item: '.slider-item',
        bar: '.slider-progress-bar',
      });

      this.animateScroll(scrollbreakingnews);
    }, 200);
  }

  showLoader(): void {
    const loader = document.querySelector('#loader');
    if (loader) {
      loader.classList.remove('hidden');
    }
  }
  
  hideLoader(): void {
    const loader = document.querySelector('#loader');
    if (loader) {
      gsap.to(loader, { opacity: 0, duration: 0.5, onComplete: () => {
        loader.classList.add('hidden');
      }});
    }
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
      this.userService
        .getFollowingUsers(this.userId)
        .pipe(
          switchMap((users: User[]) => {
            this.followingUsers = users;
            return this.postService.getRecentPostsForFollowedUsers(
              this.userId!
            );
          })
        )
        .subscribe(
          (posts: Post[]) => {
            this.recentPosts = this.groupBy(posts, 'user.id');
          },
          (error) => {
            console.error(
              'Error fetching following users or their posts',
              error
            );
          }
        );
    }
  }

  groupBy(array: Post[], key: string): Record<string, Post[]> {
    return array.reduce((result, currentValue) => {
      const groupKey = `user_${currentValue.user.id}`;
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(currentValue);
      return result;
    }, {} as Record<string, Post[]>);
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

  onLike(postId: number): void {
    const post = this.allPosts.find((p) => p.id === postId);
    const user = this.allUsers.find((u) => u.id === this.userId);

    if (post && user) {
      const index = post.reactions.findIndex((r) => r.userId === this.userId);
      if (index !== -1) {
        post.reactions.splice(index, 1);
        this.postService
          .getPost(post.id)
          .pipe(debounceTime(300))
          .subscribe(
            () => {
              console.log('Reaction removed');
            },
            (err) => {
              console.error('Error removing reaction:', err);
            }
          );
      } else {
        const data: Reaction = {
          userId: user.id,
          type: Reactiontypes.LIKE,
          postId: post.id,
        };
        this.reactionService.addAReaction(data).subscribe(
          (reaction) => {
            console.log('Reaction added:', reaction);
            post.reactions.push(reaction);
          },
          (err) => {
            console.error('Error adding reaction:', err);
          }
        );
      }
    }
  }

  ShowComments(postId: number): void {
    if (postId) {
      this.commentService
        .getCommentsByPostId(postId)
        .subscribe((comments: unknown) => {
          this.recentComments = comments as Comment[];
          this.commentsSection.nativeElement.style.display = 'block';
        });
    }
  }

  onSave(postId: number) {
    const post = this.allPosts.find((p) => p.id === postId);
    const user = this.allUsers.find((u) => u.id === this.userId);

    if (user && this.userId) {
      if (post && !this.isPostSaved(post, user)) {
        this.userService.addSavedPost(this.userId, postId).subscribe(
          () => {
            post.usersWhoSaved.push(user);
            console.log('Post saved');
          },
          (err) => {
            console.error('Error saving post:', err);
          }
        );
      } else if (post && this.isPostSaved(post, user)) {
        this.userService.deleteSavedPost(this.userId, postId).subscribe(
          () => {
            const index = post.usersWhoSaved.findIndex((u) => u.id === user.id);
            if (index !== -1) {
              post.usersWhoSaved.splice(index, 1);
            }
            console.log('Post removed from saved');
          },
          (err) => {
            console.error('Error removing post:', err);
          }
        );
      }
    }
  }

  isPostSaved(post: Post, user: User): boolean {
    return post.usersWhoSaved.some((u) => u.id === user.id);
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

  followingUsersPosts() {
    console.log(this.userId);
    this.postService
      .getRecentPostsForFollowedUsers(this.userId!)
      .subscribe((posts: Post[]) => {
        const groupBy = (array: Post[]) => {
          const res: Record<any, any> = {};
          for (const el of array) {
            if (Object.keys(res).includes(`user_${el.user.id}`)) {
              res[`user_${el.user.id}`].push(el);
            } else {
              res[`user_${el.user.id}`] = [el];
            }
          }
          return res;
        };
        this.recentPosts = groupBy(posts);
        console.log((this.recentPosts = groupBy(posts)));
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
