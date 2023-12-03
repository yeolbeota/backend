import { Injectable, CanActivate } from '@nestjs/common';
import { Observable } from 'rxjs';
import { isDevelopment } from 'src/constants/util';

@Injectable()
export class DebugGuard implements CanActivate {
  canActivate(): boolean | Promise<boolean> | Observable<boolean> {
    return isDevelopment();
  }
}
