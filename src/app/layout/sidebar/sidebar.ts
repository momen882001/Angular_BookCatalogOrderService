import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}

  toggleSidebar(): void {
    const body = document.querySelector('body');
    if (body) {
      if (body.classList.contains('toggle-sidebar')) {
        this.renderer.removeClass(body, 'toggle-sidebar');
      } else {
        this.renderer.addClass(body, 'toggle-sidebar');
      }
    }
  }
}
