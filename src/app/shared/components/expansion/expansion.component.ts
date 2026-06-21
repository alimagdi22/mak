import { Component, Input } from '@angular/core';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-expansion',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './expansion.component.html',
  styleUrl: './expansion.component.scss',
})
export class ExpansionComponent {
  @Input({ required: true }) title = '';
}
