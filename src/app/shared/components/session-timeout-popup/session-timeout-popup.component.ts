import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-session-timeout-popup',
  templateUrl: './session-timeout-popup.component.html',
  styleUrls: ['./session-timeout-popup.component.scss'],
})
export class SessionTimeoutPopupComponent implements OnInit, OnDestroy {
  @Input() timeoutSeconds: number = 900; // 15 minutes
  @Input() message: string = 'Your session has expired.';
  @Input() buttonText: string = 'Go to Login';
  @Input() redirectPath: string = '/login';
  @Input() bgColor: string = '#ffffff';
  @Input() textColor: string = '#000000';
  @Input() buttonBgColor: string = '#000000';
  @Input() buttonTextColor: string = '#ffffff';

  countdown: number = 0;
  showPopup: boolean = false;
  private interval: any;
  private currentSid: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const sid = params['sid'] || null;
      this.currentSid = sid;
      this.initializeCountdown(sid);
    });
  }

  initializeCountdown(sid: string | null): void {
    if (!sid) return;

    const sessionData = JSON.parse(localStorage.getItem('checkout-session') || '{}');

    if (sessionData?.sid === sid && sessionData?.startTime) {
      const now = Date.now();
      const elapsed = Math.floor((now - sessionData.startTime) / 1000); // in seconds
      const remaining = this.timeoutSeconds - elapsed;

      if (remaining <= 0) {
        this.showPopup = true;
        localStorage.removeItem('checkout-session');
      } else {
        this.countdown = remaining;
        this.startCountdown();
      }
    } else {
      // SID changed or new session
      this.countdown = this.timeoutSeconds;
      const newSession = {
        sid,
        startTime: Date.now(),
      };
      localStorage.setItem('checkout-session', JSON.stringify(newSession));
      this.startCountdown();
    }
  }

  startCountdown(): void {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.interval);
        this.showPopup = true;
        localStorage.removeItem('checkout-session');
      }
    }, 1000);
  }

  navigate(): void {
    this.router.navigate([this.redirectPath]);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
