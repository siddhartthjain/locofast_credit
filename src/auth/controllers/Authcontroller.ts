import { RestController, Response, Request } from "@libs/core";
import { Controller, Post, Req, Res } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { OTP_ROUTES_LIMIT, OTP_ROUTES_TTL } from "../constants";
import { OTPService } from "../services/OTPService";

@Controller('auth')
export class AuthController extends RestController {
  constructor(private otpService: OTPService) {
    super();
  }

  @Post('/otp/send')
  @Throttle(OTP_ROUTES_LIMIT, OTP_ROUTES_TTL)
  async sendOTP(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const response = await this.otpService.sendOTP(req.all());
    return res.success(response);
  }

  @Post('/otp/verify')
  @Throttle(OTP_ROUTES_LIMIT, OTP_ROUTES_TTL)
  async verifyOTP(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const authData = await this.otpService.verifyOTP(req.all());
    return res.success(authData);
  }
}
