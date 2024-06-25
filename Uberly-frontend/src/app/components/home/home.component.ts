import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthData } from 'src/app/interfaces/auth-data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  user!: AuthData | null;
  @ViewChild('slider', { static: true }) sliderRef!: ElementRef;

  constructor(private authSrv: AuthService) {}

  ngOnInit(): void {
    this.authSrv.user$.subscribe((user) => (this.user = user));
  }

  ngAfterViewInit(): void {
    const scroll = new DraggableNews({
      el: '.slider',
      wrap: '.slider-wrapper',
      item: '.slider-item',
      bar: '.slider-progress-bar',
    });

    this.animateScroll(scroll);
  }

  animateScroll(scroll: DraggableNews) {
    requestAnimationFrame(() => this.animateScroll(scroll));
    scroll.raf();
  }
}

class DraggableNews {
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
