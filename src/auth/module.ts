import { CommonModule } from '@app/_common';
import { Module } from '@nestjs/common';
import { AuthController } from './controllers/Authcontroller';
import { OTPService } from './services/OTPService';

@Module({
  imports: [CommonModule],
  exports: [],
  controllers: [AuthController],
  providers: [OTPService],
})
export class AuthModule {}
