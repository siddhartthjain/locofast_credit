import { InvoicingRootModule } from '@app/Invoicing_root/module';
import { CommonModule } from '@app/_common';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthController } from './controllers/Authcontroller';
import { OTPService } from './services/OTPService';

@Module({
  imports: [CommonModule, InvoicingRootModule, HttpModule],
  exports: [],
  controllers: [AuthController],
  providers: [OTPService],
})
export class AuthModule {}
