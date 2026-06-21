import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from 'rp-travel-ui';
import { SharedService } from '../../../shared.service';

@Component({
  selector: 'app-sign-out-alert-modal',
  templateUrl: './sign-out-alert-modal.component.html',
  styleUrls: ['./sign-out-alert-modal.component.scss'],
  standalone: true,
  imports: [MatButtonModule],
})
export class SignOutAlertModalComponent {
  @Output() clickCancel = new EventEmitter<null>();

  sharedService = inject(SharedService);
  authService = inject(AuthService);
  router = inject(Router);

  onClickSignOut() {
    this.authService.removeToken();
    this.sharedService.closeModals();
    this.router.navigate(['']);
  }

  onClickCancel() {
    this.clickCancel.emit(null);
  }
}
