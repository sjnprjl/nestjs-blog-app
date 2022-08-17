import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JWT } from 'config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreException: false,
      secretOrKey: JWT.secretOrKey,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOneBy({
      id: payload.sub,
    });
    if (!user) throw new BadRequestException('user is not authorized');
    return user;
  }
}
