import { CommonModule } from '@angular/common';
import { Component, inject, Input, output } from '@angular/core';
import { FlightResultService } from 'rp-travel-ui';
import { Subscription } from 'rxjs';
import { ISortItem } from '../../../../../shared/models/sortItem.model';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '../../../../../shared/shared.service';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrl: './sort.component.scss',
})
export class SortComponent {
  @Input({ required: true }) sortItems: ISortItem[] = [];
  openFilter = output<void>();
  flightResultService = inject(FlightResultService);
  sharedService = inject(SharedService);
  translate = inject(TranslateService);
  showFilterComponent: boolean = false;
  subscription = new Subscription();
  isOpen = false;

  ngOnInit(): void {}

  onClickSort(sortItem: ISortItem) {
    if (sortItem.isActive) {
      sortItem.isActive = false;
      this.flightResultService.sortMyResult(1);
    } else {
      this.sortItems.forEach((e) => (e.isActive = false));
      this.flightResultService.sortMyResult(sortItem.sortCode);
      sortItem.isActive = true;
      sortItem.price = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.amount;
      sortItem.currency = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.currencyCode;
    }
  }

  setSort(sortType: 'cheapest' | 'fastest' | 'earliest' | 'latest') {
    const item = this.sortItems.find((i) => i.title.toLowerCase() === sortType);
    
    if (item) {
      this.sharedService.selectedSortItem = item;
      this.onClickSort(item);
    }
  }
  cheapestSort() {}

  get activeSort(): string {
    return this.sortItems.find((item) => item.isActive)?.title.toLowerCase() || '';
  }

  toggleComponent() {
    this.showFilterComponent = !this.showFilterComponent;
  }

  closeComponent() {
    this.showFilterComponent = false;
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }
  onOptionSelect(option: string) {
    this.closeDropdown();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
