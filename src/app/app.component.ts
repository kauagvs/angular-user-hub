import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule],
  template: `
    <h1 class="text-3xl font-bold underline">
      Hello world!
    </h1>
    <router-outlet></router-outlet>
  `
})
export class AppComponent { }
