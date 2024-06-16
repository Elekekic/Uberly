import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import * as ScrollMagic from 'scrollmagic';
import 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit, OnDestroy {
  controller = new ScrollMagic.Controller();

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.initScrollMagic();
  }

  ngOnDestroy(): void {
    this.destroyScrollMagic();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    // Check body changes or renderer changes here
    console.log('Window resized');
    this.destroyScrollMagic();
    this.initScrollMagic();
  }

  private initScrollMagic(): void {
    this.controller = new ScrollMagic.Controller();

    // Example scenes (adjust as per your actual requirements)
    const first = new ScrollMagic.Scene({
      triggerElement: '#first',
      duration: '100%',
    })
      .setClassToggle('body', 'first-bg')
      .addTo(this.controller);

    const second = new ScrollMagic.Scene({
      triggerElement: '#second',
      duration: '100%',
    })
      .setClassToggle('body', 'second-bg')
      .addTo(this.controller);

    const third = new ScrollMagic.Scene({
      triggerElement: '#third',
      duration: '100%',
    })
      .setClassToggle('body', 'third-bg')
      .addTo(this.controller);

    const fourth = new ScrollMagic.Scene({
      triggerElement: '#fourth',
      duration: '100%',
    })
      .setClassToggle('body', 'fourth-bg')
      .addTo(this.controller);

    const fifth = new ScrollMagic.Scene({
      triggerElement: '#fifth',
      duration: '100%',
    })
      .setClassToggle('body', 'fifth-bg')
      .addTo(this.controller);

    const sixth = new ScrollMagic.Scene({
      triggerElement: '#sixth',
      duration: '100%',
    })
      .setClassToggle('body', 'sixth-bg')
      .addTo(this.controller);
  }

  private destroyScrollMagic(): void {
    if (this.controller) {
      this.controller.destroy(true);
    }
  }
}
