import { Component, Renderer2, AfterViewInit, OnInit } from '@angular/core';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SmoothScrollService } from 'src/app/services/smooth-scroll.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
})
export class CommunityComponent implements OnInit, AfterViewInit {
  constructor(
    private renderer: Renderer2,
    private smoothScrollService: SmoothScrollService
  ) {}

  ngOnInit(): void {
    this.startAnimations();
    this.IsInViewportFunction();
  }

  ngAfterViewInit() {
    this.spanAnimation();
    this.FaqAnimations();
  }

  scrollBackToTheTop(): void {
    this.smoothScrollService.scrollToElement('top');
  }

  startAnimations(): void {
    gsap.from('.hero p', {
      duration: 1,
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

    gsap.utils.toArray('.intro p').forEach((p: any) => {
      gsap.from(p, {
        opacity: 0,
        y: 0,
        scrollTrigger: {
          trigger: p,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    gsap.utils.toArray('.intro h1').forEach((h1: any) => {
      gsap.from(h1, {
        opacity: 0,
        y: 0,
        scrollTrigger: {
          trigger: h1,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    gsap.utils.toArray('.cards i').forEach((i: any) => {
      gsap.from(i, {
        opacity: 0,
        y: 30,
        scrollTrigger: {
          trigger: i,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    gsap.utils.toArray('.photos img').forEach((i: any) => {
      gsap.from(i, {
        opacity: 0,
        y: 30,
        scrollTrigger: {
          trigger: i,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    gsap.utils.toArray('.features-1 h3').forEach((h3: any) => {
      gsap.from(h3, {
        opacity: 0,
        y: 30,
        scrollTrigger: {
          trigger: h3,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    gsap.utils.toArray('.features-1 p').forEach((h3: any) => {
      gsap.from(h3, {
        opacity: 0,
        y: 30,
        scrollTrigger: {
          trigger: h3,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    gsap.utils.toArray('.features-1 i').forEach((h3: any) => {
      gsap.from(h3, {
        opacity: 0,
        y: 30,
        scrollTrigger: {
          trigger: h3,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    gsap.utils.toArray('.features-1 h4').forEach((h3: any) => {
      gsap.from(h3, {
        opacity: 0,
        y: 30,
        scrollTrigger: {
          trigger: h3,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    gsap.utils.toArray('.faq-container div').forEach((h3: any) => {
      gsap.from(h3, {
        opacity: 0,
        y: 30,
        scrollTrigger: {
          trigger: h3,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    gsap.utils.toArray('.cards h3').forEach((h3: any) => {
      gsap.from(h3, {
        opacity: 0,
        y: 30,
        scrollTrigger: {
          trigger: h3,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    gsap.utils.toArray('.cards-p').forEach((p: any) => {
      gsap.from(p, {
        opacity: 0,
        y: 30,
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
          start: 'top 60%',
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
          start: 'top 70% , left 50%',
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
          start: 'top 70% , left 50%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    gsap.utils.toArray('.footer-info h2').forEach((h2: any) => {
      gsap.from(h2, {
        opacity: 0,
        y: 20,
        scrollTrigger: {
          trigger: h2,
          start: 'top 35%',
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

      button.addEventListener('mouseenter', () => {
        gsap.to(button, {
          scale: 1.1,
          duration: 0.1,
          ease: 'power1.inOut',
        });
      });

      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.1,
          ease: 'power1.inOut',
        });
      });
    });
  }

  

  FaqAnimations(): void {
    const faqToggles = document.querySelectorAll('.faq-toggle');
    const faqs = document.querySelectorAll('.faq-body');

    faqToggles.forEach((button) => {
      button.addEventListener('click', () => {
        const targetSelector = button.getAttribute('data-target');
        if (targetSelector) {
          const target = document.querySelector(targetSelector) as HTMLElement;
          if (target) {
            const isOpen = target.classList.contains('open');
            if (isOpen) {
              this.closeFAQ(target);
            } else {
              this.openFAQ(target);
            }
          }
        }
      });
    });

    faqs.forEach((faq) => {
      faq.addEventListener('click', () => {
        this.closeFAQ(faq as HTMLElement);
      });
    });
  }

  openFAQ(target: HTMLElement): void {
    gsap.to(target, {
      duration: 0.4,
      maxHeight: '12vh',
      opacity: 1,
      ease: 'power4.inOut',
      onComplete: () => {
        target.classList.add('open');
      },
    });
  }

  closeFAQ(target: HTMLElement): void {
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

  spanAnimation() {
    document.querySelectorAll('.hero span').forEach((span) => {
      span.addEventListener('mouseenter', () => {
        if (span.parentNode) {
          (span.parentNode as HTMLElement).style.color = '#545454';
        }
      });

      span.addEventListener('mouseleave', () => {
        if (span.parentNode) {
          (span.parentNode as HTMLElement).style.color = '#f5e7c6';
        }
      });
    });
  }
}
