import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-why-us-card',
  templateUrl: './why-us-card.component.html',
  styleUrl: './why-us-card.component.scss',
})
export class WhyUsCardComponent {
  @Input({ required: true }) whyUsCard: {
    title: string;
    image: string;
    description: string;
  } = {
    title: '',
    description: '',
    image: '',
  };
}
