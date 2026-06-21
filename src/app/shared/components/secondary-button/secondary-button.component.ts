import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IMainButton } from '../../models/flights/mainButton.model';

@Component({
  selector: 'app-secondary-button',
  templateUrl: './secondary-button.component.html',
  styleUrl: './secondary-button.component.scss',
})
export class SecondaryButtonComponent {
  @Input({ required: true }) secondaryButtonInfo: IMainButton = {
    height: '20px',
    width: '100%',
    title: 'Main Button',
    borderRadius: '6px',
  };

  @Output() clickSecondaryButton = new EventEmitter<null>();

  onClick(e: Event) {
    e.preventDefault();
    this.clickSecondaryButton.emit(null);
  }
}
