import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { SignUp } from 'src/app/interfaces/sign-up';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { gsap } from 'gsap';
import $ from 'jquery';
import { CSSPlugin, TextPlugin, Elastic } from 'gsap/all';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, AfterViewInit {

  userReg!: SignUp;
  selectedRole: string = '';

  constructor(private authSrv: AuthService, private router: Router) {}

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.initAnimation();
  }

  onSubmit(form: NgForm) {
    form.value.role = this.selectedRole;
    console.log(form.value);
    this.authSrv.signup(form.value).subscribe(
      (response) => {
        alert("Registrazione effettuata")
        console.log(response);
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  selectRole(event: any) {
    const role = event.target.getAttribute('data-val');
    this.selectedRole = role;
  }

  initAnimation(): void {
    const inputPreview = $(".input-preview");
    const input = $(".input");

    gsap.registerPlugin(CSSPlugin, TextPlugin, Elastic);

    gsap.set(input, {
      scale: 1.2,
      opacity: 0
    });

    inputPreview.on("click", function() {
      const that = $(this);
      that.toggleClass("active");

      if (that.hasClass("active")) {
        gsap.to(input, {
          duration: 1.25,
          scale: 1,
          opacity: 1,
          ease: "elastic.out",
          stagger: 0.1
        });
      } else {
        gsap.to(input, {
          duration: 1,
          scale: 1.2,
          opacity: 0,
          ease: "elastic.out",
          stagger: 0.1
        });
      }
    });

    input.on("click", function() {
      const tlInput = gsap.timeline({
        onComplete: done
      });

      const that = $(this);
      const siblings = that.siblings(".input");
      const data = that.data("val");
      const top = that.css("top");

      siblings.removeClass("active");

      tlInput.to(siblings, {
        duration: 0.25,
        opacity: 0
      })
      .to(that, {
        duration: 0.25,
        scale: 1.2
      })
      .to(that, {
        duration: 0.25,
        top: 0
      })
      .set(inputPreview, {
        display: "none"
      })
      .to(that, {
        duration: 0.2,
        scale: 1
      })
      .to(that, {
        duration: 0.5,
      })
      .set(inputPreview, {
        text: data,
        display: "block"
      })
      .to(that, {
        duration: 0.4,
        opacity: 0
      });

      function done() {
        inputPreview.removeClass("active");
        that.css("top", top).addClass("active");

        gsap.set(input, {
          scale: 1.2,
          opacity: 0,
          backgroundColor: "#9b9b9"
        });
      }
    });
  }
}
