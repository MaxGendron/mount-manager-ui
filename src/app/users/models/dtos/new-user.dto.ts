export class NewUserDto {
  constructor(
    public username: string,
    public email: string,
    public password: string,
  ) {}
}