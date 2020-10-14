import { UserPropertyEnum } from '../enum/user-property.enum';

export class ValidateUserPropertyValueDto {
  constructor(public property: UserPropertyEnum, public value: string) {}
}
