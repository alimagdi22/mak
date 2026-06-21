import { Component, Input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-input-header',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './input-header.component.html',
  styleUrl: './input-header.component.scss',
})
export class InputHeaderComponent {
  @Input({ required: true }) headerTitle = '';
  onClickClose = output<void>();
}
