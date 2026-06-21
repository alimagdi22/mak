import { Component, Input } from '@angular/core';
import { IScheduleOption } from '../../../../../../../shared/models/scheduleOption.model';
import { SCHEDULE_OPTION_DEFAULT } from '../../../../../../../core/constants/default/schedule-option.default';
@Component({
  selector: 'app-schedule-option',
  templateUrl: './schedule-option.component.html',
  styleUrl: './schedule-option.component.scss',
})
export class ScheduleOptionComponent {
  @Input({ required: true }) scheduleOption: IScheduleOption = SCHEDULE_OPTION_DEFAULT;
}
