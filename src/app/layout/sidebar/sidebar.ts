import { Component, Renderer2, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { StorageService } from '../../core/services/storage.service';
import { ILoginResponse } from '../../features/auth/interfaces/AuthInterface';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  constructor(
    private renderer: Renderer2,
    private authservice: AuthService,
    private storageService: StorageService,
  ) {}

  ngOnInit(): void {}

  getUsername(): string {
    const userData = this.storageService.getItem<ILoginResponse>('userData');
    return userData?.firstname + ' ' + userData?.lastname || 'Admin Dashboard';
  }

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

  logout(): void {
    this.authservice.logout();
  }
}
