import { ICheckBox } from '../../../shared/models/checkBox.model';
import { IScheduleOption } from '../../../shared/models/scheduleOption.model';
import { ISortItem } from '../../../shared/models/sortItem.model';

export const SCHEDULE_OPTION_DEFAULT: IScheduleOption = {
  icon: '',
  title: '',
  startTime: '',
  endTime: '',
  isActive: false,
};

export const CHECK_BOX_DEFAULT: ICheckBox = {
  title: '',
  formControlName: '',
};

export const SORT_ITEM_DEFAULT: ISortItem = {
  title: '',
  price: '',
  currency: '',
  isActive: false,
  sortCode: -1,
};