import { AfterViewInit, Directive, NgZone, OnDestroy, Renderer2 } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appDatepickerRtl]',
  standalone: true
})
export class DatepickerRtlDirective implements AfterViewInit, OnDestroy {
  private observer: MutationObserver | null = null;
  private langSub: Subscription | null = null;

  constructor(
    private renderer: Renderer2,
    private translate: TranslateService,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    // Run the MutationObserver outside Angular to avoid change detection spam
    this.ngZone.runOutsideAngular(() => {
      this.observer = new MutationObserver(() => this.applyToPickers());
      this.observer.observe(document.body, { childList: true, subtree: true });
    });

    // apply once in case a picker is already open
    this.applyToPickers();

    // listen to language changes so open popups flip immediately
    this.langSub = this.translate.onLangChange.subscribe((_: LangChangeEvent) => {
      // small timeout ensures DOM changes from ngb complete first
      setTimeout(() => this.applyToPickers(), 0);
    });
  }

  private applyToPickers() {
    const isAr = this.translate.currentLang === 'ar';
    // select common ng-bootstrap datepicker popup classes
    const selectors = [
      '.ngb-dp', '.ngb-datepicker', '.ngb-datepicker-popup', '.ngb-datepicker-wrapper'
    ];
    const nodes = Array.from(document.querySelectorAll(selectors.join(',')));

    nodes.forEach((node: Element) => {
      // set dir attribute on the popup element (so it renders RTL)
      this.renderer.setAttribute(node, 'dir', isAr ? 'rtl' : 'ltr');

      // helper class to add custom RTL tweaks in CSS
      if (isAr) this.renderer.addClass(node, 'ngb-dp-rtl');
      else this.renderer.removeClass(node, 'ngb-dp-rtl');
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.langSub?.unsubscribe();
  }
}
