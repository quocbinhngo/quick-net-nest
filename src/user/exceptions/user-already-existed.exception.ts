import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistedException extends HttpException {
  constructor() {
    super('User already existed', HttpStatus.CONFLICT);
  }
}
