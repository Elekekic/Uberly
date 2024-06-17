import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit, OnInit {

  constructor(private renderer: Renderer2) {}


  ngOnInit(): void {
   
  }

 
  ngAfterViewInit() {
    const primaryNav = this.renderer.selectRootElement('.primary-navigation', true);
    const navToggle = this.renderer.selectRootElement('.mobile-nav-toggle', true);

    this.renderer.listen(navToggle, 'click', () => {
      const visibility = primaryNav.getAttribute('data-visible');

      if (visibility === "false") {
        primaryNav.setAttribute('data-visible', 'true');
        navToggle.setAttribute('aria-expanded', true);
      } else {
        primaryNav.setAttribute('data-visible', 'false');
        navToggle.setAttribute('aria-expanded', false);
      }
    });
  }
}
