import {
  AfterViewInit,
  Component,
  OnInit,
  Renderer2,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements AfterViewInit, OnInit {
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.startLoader();
    this.startAnimations();
    this.IsInViewportFunction();
  }

  ngAfterViewInit(): void {
    this.startLoader();
  }

  startLoader(): void {
    let counter = document.querySelector('.counter');
    let currentValue = 0;

    function updateCounter(): void {
      if (currentValue === 100) {
        return;
      }

      currentValue += Math.floor(Math.random() * 10) + 1;

      if (currentValue > 100) {
        currentValue = 100;
      }

      if (counter) {
        counter.textContent = currentValue.toString();
      }

      let delay = Math.floor(Math.random() * 150) + 30;
      setTimeout(updateCounter, delay);
    }

    updateCounter();
  }

  startAnimations(): void {
    gsap.to('.counter', {
      duration: 0.25,
      delay: 3.5,
      opacity: 0,
      onComplete: () => {
        let overlay = document.querySelector('.overlay');
        let counter = document.querySelector('.counter');
        if (counter && overlay) {
          counter.remove();
          overlay.remove();
        }
      },
    });

    gsap.to('.bar', {
      duration: 1.5,
      delay: 3.5,
      height: 0,
      stagger: {
        amount: 0.5,
      },
      ease: 'power4.inOut',
    });

    gsap.from('.h1', {
      duration: 1.5,
      delay: 4,
      y: 0,
      opacity: 0,
      stagger: {
        amount: 0.5,
      },
      ease: 'power4.inOut',
    });
  }

  IsInViewportFunction () {
    gsap.registerPlugin(ScrollTrigger);
      function isInViewPort(el: Element) {
        const rect = el.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <=
            (window.innerHeight || document.documentElement.clientWidth)
        );
      }
  
      const rows = document.querySelectorAll('.roww');
      rows.forEach((row) => {
        if (isInViewPort(row)) {
          const img = row.querySelector('img');
          if (row.querySelector('.left')) {
            gsap.to(img, {
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            });
          } else {
            gsap.to(img, {
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            });
          }
        }
      });
  
      gsap.utils.toArray(".img-container.right img").forEach((img:any) => {
        gsap.to(img, {
          clipPath:'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          scrollTrigger: {
            trigger: img,
            start: "top 75%",
            end: "bottom 70%",
            scrub: true, 
          }
        })
      })
  
  
      gsap.utils.toArray(".img-container.left img").forEach((img:any) => {
        gsap.to(img, {
          clipPath:'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          scrollTrigger: {
            trigger: img,
            start: "top 75%",
            end: "bottom 70%",
            scrub: true, 
          }
        })
      })
  
      gsap.utils.toArray(".img-container p").forEach((p:any) => {
        gsap.from(p, {
          opacity:0,
          y:20,
          scrollTrigger: {
            trigger: p,
            start: "top 90%",
            toggleActions: "play none none reverse",
          }
        })
      } )
    };
  }
