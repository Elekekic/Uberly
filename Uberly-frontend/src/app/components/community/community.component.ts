import { Component, Renderer2, AfterViewInit} from '@angular/core';
import gsap from 'gsap';
import { SmoothScrollService } from 'src/app/services/smooth-scroll.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
})
export class CommunityComponent implements AfterViewInit {

  constructor(private smoothScrollService: SmoothScrollService ) {}

  ngAfterViewInit() {
    this.spanAnimation();
    this.FaqAnimations();
  }

  scrollBackToTheTop(): void {
    this.smoothScrollService.scrollToElement('top');
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
