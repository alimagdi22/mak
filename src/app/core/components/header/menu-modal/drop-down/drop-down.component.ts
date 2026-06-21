import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { UserProfileService } from 'rp-travel-ui';
import { SignOutAlertModalComponent } from '../../../../../shared/components/user-management/sign-out-alert-modal/sign-out-alert-modal.component';
import { SharedService } from '../../../../../shared/shared.service';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss'],
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, RouterLink, SignOutAlertModalComponent],
})
export class DropDownComponent {
  @ViewChild('dropDownTrigger') dropDownTrigger!: MatMenuTrigger;

  alertTrigger = false;
  isAtHome = false;

  userProfileService = inject(UserProfileService);
  sharedService = inject(SharedService);
  private router = inject(Router); // Injecting Router

  constructor() {
    this.router.events.subscribe(() => {
      this.isAtHome = this.router.url === '/';
    });
  }

  get userName() {
    return this.userProfileService.user.firstName + ' ' + this.userProfileService.user.lastName;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    const screenWidth = window.innerWidth;
    if (screenWidth < this.sharedService.webViewBreakPoint) this.alertTrigger = false;
  }
}
