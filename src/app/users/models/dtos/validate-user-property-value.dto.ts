export enum UserPropertyEnum {
  Username = 'username',
  Email = 'email'
}

export class ValidateUserPropertyValueDto {
  constructor(
    public property: UserPropertyEnum,
    public value: string
  ) {}
}
