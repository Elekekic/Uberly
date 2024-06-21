import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-error-404',
  templateUrl: './error-404.component.html',
  styleUrls: ['./error-404.component.scss']
})
export class Error404Component implements OnInit, AfterViewInit {

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.IsInViewportFunction();
  }

  ngOnInit(): void {}

  IsInViewportFunction() {

    gsap.registerPlugin(ScrollTrigger);

    const cards = [
      { id: "#card-1", endTranlateX: -2000, rotate: 45 },
      { id: "#card-2", endTranlateX: -1000, rotate: -30 },
      { id: "#card-3", endTranlateX: -2000, rotate: 45 },
      { id: "#card-4", endTranlateX: -1000, rotate: -30 }
    ];

    ScrollTrigger.create({
      trigger: ".wrapper-404",
      start: "top top",
      end: "+=900vh",
      scrub: 1,
      pin: true,
      onUpdate: (self) => {
        gsap.to(".wrapper-404", {
          x: `${-350 * self.progress}vw`,
          duration: 0.5,
          ease: "power3.out",
        });
      }
    });

    cards.forEach((card) => {
      ScrollTrigger.create({
        trigger: card.id,
        start: "top top",
        end: "+=1440vh",
        scrub: 1,
        onUpdate: (self) => {
          gsap.to(card.id, {
            x: `${card.endTranlateX * self.progress}px`,
            rotate: `${card.rotate * self.progress * 2}`,
            duration: 0.5,
            ease: "power3.out"
          });
        }
      });
    });
  }
}
