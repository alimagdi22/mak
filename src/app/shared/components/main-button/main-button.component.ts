import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IMainButton } from '../../models/flights/mainButton.model';

@Component({
  selector: 'app-main-button',
  templateUrl: './main-button.component.html',
  styleUrl: './main-button.component.scss',
})
export class MainButtonComponent {
  @Input({ required: true }) mainButtonInfo: IMainButton = {
    height: '20px',
    width: '100%',
    title: 'Main Button',
    borderRadius: '6px',
  };
  @Input() isLoading = false;
  @Input() isDisibled = false;

  @Output() clickMainButton = new EventEmitter<null>();

  onClick(e: Event) {
    e.stopPropagation();
    this.clickMainButton.emit(null);
  }
}
