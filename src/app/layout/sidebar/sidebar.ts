import { Component, Renderer2, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { StorageService } from '../../core/services/storage.service';
import { ILoginResponse } from '../../features/auth/interfaces/AuthInterface';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserRoleEnum } from '../../shared/enums/UserRoleEnum';
import { NotificationService } from '../../core/services/notification.service';
import { SuccessMessages } from '../../core/constants/successMessages';

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
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {}

  isUserAdmin(): boolean {
    return this.authservice.getUserData?.role === UserRoleEnum.ADMIN;
  }

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
    this.notificationService.success(SuccessMessages.logout);
  }
}
