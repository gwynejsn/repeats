import { AfterViewInit, Component } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-gsap-test',
  standalone: true,
  template: `
    <div class="box"></div>
    <button (click)="animateBox()">Animate</button>
  `,
  styles: [
    `
      .box {
        width: 100px;
        height: 100px;
        background-color: #4caf50;
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class GsapTestComponent implements AfterViewInit {
  ngAfterViewInit() {}

  animateBox() {
    gsap.from('.box', {
      x: -200,
      duration: 1.5,
      ease: 'power2.inOut',
    });
  }
}
