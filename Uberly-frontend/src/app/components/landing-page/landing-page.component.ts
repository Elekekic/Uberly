import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SmoothScrollService } from 'src/app/services/smooth-scroll.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements AfterViewInit, OnInit {
  constructor(private renderer: Renderer2, private smoothScrollService: SmoothScrollService ) {}

  ngOnInit(): void {
    this.startLoader();
    this.startAnimations();
    this.IsInViewportFunction();
  }

  scrollBackToTheTop(): void {
    this.smoothScrollService.scrollToElement('top');
  }
  
  ngAfterViewInit(): void {
   this.startLoader();
    this.renderer.listen('window', 'load', () => {
      this.scrollToTop();
    });

    setTimeout(() => {
      this.scrollToTop();
    }, 0);
  }

  scrollToTop() {
    window.scrollTo(0, 0);
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

    gsap.from('.sub-header', {
      duration: 1.5,
      delay: 5,
      y: 0,
      opacity: 0,
      stagger: {
        amount: 0.5,
      },
      ease: 'power4.inOut',
    });
  }

  IsInViewportFunction() {

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

    gsap.utils.toArray('.img-container.right img').forEach((img: any) => {
      gsap.to(img, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        scrollTrigger: {
          trigger: img,
          start: 'top 75%',
          end: 'bottom 70%',
          scrub: true,
        },
      });
    });

    gsap.utils.toArray('.img-container.left img').forEach((img: any) => {
      gsap.to(img, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        scrollTrigger: {
          trigger: img,
          start: 'top 75%',
          end: 'bottom 70%',
          scrub: true,
        },
      });
    });

    gsap.utils.toArray('.img-container p').forEach((p: any) => {
      gsap.from(p, {
        opacity: 0,
        y: 20,
        scrollTrigger: {
          trigger: p,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    gsap.utils.toArray('.section-cta-img img').forEach((img: any) => {
      gsap.from(img, {
        opacity: 0,
        y: 0,
        scrollTrigger: {
          trigger: img,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    gsap.utils.toArray('.section-cta-info h2').forEach((h2: any) => {
      gsap.from(h2, {
        opacity: 0,
        y: 20,
        scrollTrigger: {
          trigger: h2,
          start: 'top 80% , left 50%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    gsap.utils.toArray('.section-cta-info p').forEach((p: any) => {
      gsap.from(p, {
        opacity: 0,
        y: 20,
        scrollTrigger: {
          trigger: p,
          start: 'top 80% , left 50%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    gsap.utils.toArray('.cta a').forEach((button: any) => {
      gsap.from(button, {
        opacity: 0,
        y: 20,
        scrollTrigger: {
          trigger: button,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      button.addEventListener("mouseenter", () => {
        gsap.to(button, {
          scale: 1.1,
          duration: 0.1,
          ease: "power1.inOut"
        });
      });
  
      button.addEventListener("mouseleave", () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.1,
          ease: "power1.inOut"
        });
      });
    });

    gsap.utils.toArray('.section-features-h2').forEach((h2: any) => {
      gsap.from(h2, {
        opacity: 0,
        y: 20,
        scrollTrigger: {
          trigger: h2,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    gsap.utils.toArray('.stars i').forEach((stars: any) => {
      gsap.from(stars, {
        opacity: 0,
        y: 20,
        scrollTrigger: {
          trigger: stars,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    gsap.utils.toArray('.text p').forEach((p: any) => {
      gsap.from(p, {
        opacity: 0,
        y: 20,
        scrollTrigger: {
          trigger: p,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    gsap.utils.toArray('.info-user p').forEach((p: any) => {
      gsap.from(p, {
        opacity: 0,
        y: 20,
        scrollTrigger: {
          trigger: p,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    gsap.utils.toArray('.footer-info h2').forEach((h2: any) => {
      gsap.from(h2, {
        opacity: 0,
        y: 10,
        scrollTrigger: {
          trigger: h2,
          start: 'top 20%',
          toggleActions: 'play none none reverse',
        },
      });
    });
  }
}
