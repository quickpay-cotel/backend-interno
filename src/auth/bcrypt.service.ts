import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptService {
  //private readonly saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    //const salt = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
