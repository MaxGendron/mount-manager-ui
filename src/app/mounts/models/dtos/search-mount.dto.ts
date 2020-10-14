import { MountTypeEnum } from './../enum/mount-type.enum';
import { MountGenderEnum } from './../enum/mount-gender.enum';
import { MountSortFieldEnum } from '../enum/mount-sort-field.enum';
import { SortOrderEnum } from '../../../common/enum/sort-order.enum';

export class SearchMountDto {
  //Sort
  sortField?: MountSortFieldEnum;
  sortOrder?: SortOrderEnum;

  //Search
  name?: string;

  //Filters
  gender?: MountGenderEnum;
  type?: MountTypeEnum;
  colorId?: string;
}
