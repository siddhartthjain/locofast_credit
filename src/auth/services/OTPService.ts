import { RedisService } from "@app/redis/service";
import { ACTIVATION_STATUS, InvoicingUserContract, INVOICING_USER_REPO, REDIS_HASH_NAMES, ROOT_USER_TYPES } from "@app/_common";
import { randomString } from "@libs/core";
import { BaseValidator } from "@libs/core/validator";
import { HttpService } from "@nestjs/axios";
import { ForbiddenException, HttpServer, Inject, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_TYPE, CREDIT_CUTOMER } from "../constants";
import { AttemptData } from "../interfaces";
import { SendOTP, VerifyOTP } from "../Validator";

export class OTPService
{  
    attemptsKey = REDIS_HASH_NAMES.ATTEMPTS_KEY;
    blockedNumbersKey = REDIS_HASH_NAMES.BLOCKED_NUMBERS_KEY;
    mobileAuthKey = REDIS_HASH_NAMES.MOBILE_AUTH_KEY;
    customerVerificationToken = REDIS_HASH_NAMES.CUSTOMER_VERIFICATION_TOKEN;
    constructor(
        private validator :BaseValidator ,
        @Inject(INVOICING_USER_REPO) private invoicingusers: InvoicingUserContract ,
        private redisService: RedisService,
        private httpService: HttpService,
        private config :ConfigService

    ){}

    async sendOTP(inputs): Promise<Record<string, any>> {
        // Validate number
        await this.validator.fire(inputs, SendOTP);
  
        const user = {
          isCustomer: 0,
          isSupplier: 0,
          //isInternalUser: 0,  no need of internal user in this app
        };
  
        const input = inputs.mobile || inputs.email;
  
        const whereBuilder = `u.email = '${input}' OR  u.phone = '${input}'`;
  
        const doesUserExists = await this.invoicingusers
          .query()
          .alias('u')
          .whereRaw(`${whereBuilder}`)
          .where('u.role', '>=', +ROOT_USER_TYPES.CREDIT_CUSTOMER)
        //   .select(
        //     // 'organization.isInternational',
        //     // 'u.role',
        //     // 'u.status',
        //     // 'u.is_enabled',
        //     // 'u.brand as org_id',
        //     // 'u.phone',
        //     // 'u.calling_code',
        //   )
          .first();
  
        // if (
        //   (!doesUserExists || doesUserExists.role !== FABRIC_CUSTOMER_ADMIN) &&
        //   inputs.email
        // ) {
        //   throw new ForbiddenException(
        //     'Unable to verify email id, please contact your relationship manager or login through phone number',
        //   );
        // }
  
        let mobile = `+91${inputs.mobile}`;
  
        if (doesUserExists && inputs.email) {
          mobile = `${doesUserExists.callingCode}${doesUserExists.phone}`;
        }
      
        // commented due to emailing
        // await Promise.all([
        //   this.checkIfDeactivated(input),
        //   this.checkIsNumberBlocked(mobile),
        // ]);
  
        if (
          doesUserExists &&
          doesUserExists.status === ACTIVATION_STATUS.INACTIVE &&
          doesUserExists.role === ROOT_USER_TYPES.SUPPLIER
        ) {
        //   const data = {
        //     event: 'supplier.deactivate-login',
        //     data: {
        //       phone: inputs.mobile,
        //     },
        //   };
        //   this.notificationProducerService.sendData(
        //     data,
        //     this.emailNotificationQueueUrl,
        //   ); // commented due to mailing
          throw new ForbiddenException({
            title: 'Login Error',
            message: `We're unable to fetch your account details. Please contact Locofast support on +91 89207 24832 for further details.`,
          });
        }
  
        const appType = inputs.appType;
        let userRole: string;
  
        if (!doesUserExists) {
          // To self onboard a customer
          userRole = ROOT_USER_TYPES.CREDIT_CUSTOMER;
          throw new ForbiddenException({
            title: 'Login Error',
            message: `You are not allowed to use this app please register yourself  `,
          });
        } else {
          if (
            doesUserExists &&
            (doesUserExists.status !== ACTIVATION_STATUS.ACTIVE ||
              !doesUserExists.isEnabled)
          ) {
            throw new UnauthorizedException({
              title: 'Not registered yet!',
              message:
                'It looks like you are not registered with us yet. Please mail us at mail@locofast.com to get registered.',
            });
          }
  
          userRole = doesUserExists.role;
          switch (userRole) {
            case ROOT_USER_TYPES.CREDIT_CUSTOMER:
              user.isCustomer = 1;
              break;
            case ROOT_USER_TYPES.SUPPLIER:
              user.isSupplier = 1;
              break;
            default:
            //   user.isInternalUser = INTERNAL_USERS.includes(userRole) ? 1 : 0;
            throw new UnauthorizedException({
                title: 'Not registered yet!',
                message:
                  'It seems you are internal user trying to use customer app.',
              });

              break;
          }
        }
  
        // if (appType === APP_TYPE.CUSTOMER && userRole !== FABRIC_CUSTOMER_ADMIN) {
        //   if (userRole === FABRIC_SUPPLIER_ADMIN) {
        //     throw new ForbiddenException({
        //       title: 'You are a supplier trying to use the Customer App',
        //       message: `It seems that you are a supplier trying to use the Customer App. Please download the Supplier App`,
        //       url: APP_LINK.SUPPLY_APP_LINK,
        //       user,
        //     });
        //   }
  
        //   if (INTERNAL_USERS.includes(userRole)) {
        //     throw new ForbiddenException({
        //       title: 'You are an internal user trying to use the Customer App',
        //       message: `It seems that you are an internal user trying to use the Customer App.`,
        //       url: process.env.FABRIC_APP_URL || '',
        //       user,
        //     });
        //   }
        // } else if (
        //   appType === APP_TYPE.SUPPLIER &&
        //   userRole === FABRIC_CUSTOMER_ADMIN
        // ) {
        //   throw new ForbiddenException({
        //     title: 'You are a customer trying to use the Supplier App',
        //     message: `It seems that you are a customer trying to use the Supplier App. Please download the Customer App`,
        //     url: APP_LINK.CUSTOMER_APP_LINK,
        //     user,
        //   });
        // }
  
        const [loginAttempt, keyTTL] = await this.fetchLoginAttempt(mobile);
  
        if (!loginAttempt) {
          let otp = process.env.DEFAULT_OTP || '1234';
  
        //   if (
        //     process.env.APP_ENV === 'production' &&
        //     inputs.mobile &&
        //     !this.defaultOtpPhoneNumbers.includes(+inputs.mobile)
        //   ) {
        //     otp = randomNumber(4);
        //     await this.msg91Service.sendSMS({
        //       mobiles: `91${inputs.mobile}`,
        //       var: otp,
        //     });
        //   } else if (inputs.email) {
        //     await this.notificationProducerService.sendData(
        //       {
        //         event: 'customer-otp.email',
        //         data: {
        //           otp,
        //           orgId: doesUserExists.orgId,
        //         },
        //       },
        //       this.emailNotificationQueueUrl,
        //     );
        //   }
  
          await this.redisService.set(
            `${this.attemptsKey}${mobile}`,
            JSON.stringify({
              attempts: 1,      // resend many times but after fillingthe wrong otp we will increase the attempts
              lastOtpActionAt: new Date().getTime(),
              otp,
            }),
            60 * 60,
          );
        } else {
          if (loginAttempt.attempts > 9) {
            await this.redisService.set(
              `${this.blockedNumbersKey}${mobile}`,
              '1',
              24 * 60 * 60,
            );
            throw new ForbiddenException(
              'You’ve made too many incorrect attempts. Your account is blocked for 24 hrs.',
            );
          } else {
            // if (process.env.APP_ENV === 'production' && inputs.mobile) {
            //   await this.msg91Service.sendSMS({
            //     mobiles: `91${inputs.mobile}`,
            //     var: `${loginAttempt.otp}`,
            //   });
            // } else if (inputs.email) {
            //   await this.notificationProducerService.sendData(
            //     {
            //       event: 'customer-otp.email',
            //       data: {
            //         otp: loginAttempt.otp,
            //         orgId: doesUserExists.orgId,
            //       },
            //     },
            //     this.emailNotificationQueueUrl,
            //   );
            // }
  
            await this.redisService.set(
              `${this.attemptsKey}${mobile}`,
              JSON.stringify({
                attempts: loginAttempt.attempts + 1,
                lastOtpActionAt: new Date().getTime(),
                otp: loginAttempt.otp,
              }),
              keyTTL,
            );
          }
        }
  
        return { message: 'OTP Sent', ...user };
      }

      async verifyOTP(inputs): Promise<Record<string, any>> {
        // Validate number
        await this.validator.fire(inputs, VerifyOTP);
  
        let mobile,
          phoneNumber,
          countryCode = '+91';
  
        if (inputs.email) {
          const userDetails = await this.invoicingusers
            .query()
            .select( 'phone_no')
            .where({ email: inputs.email, role:ROOT_USER_TYPES.CREDIT_CUSTOMER })
            .first();
  
          if (!userDetails) {
            throw new ForbiddenException(
              'Unable to verify email id, please contact your relationship manager or login through phone number',
            );
          }
  
          const {phone_no } = userDetails;
          (phoneNumber = phone_no), 
        //   (countryCode = callingCode);
        //   mobile = `${callingCode}${phone}`;
        mobile = `${countryCode}${phone_no}`;

        } else {
          mobile = `+91${inputs.mobile}`;
          phoneNumber = inputs.mobile;
        }
  
        await this.checkIsNumberBlocked(mobile);
        const [loginAttempt, keyTTL] = await this.fetchLoginAttempt(mobile);
        if (!loginAttempt) {
          throw new ForbiddenException(
            "We couldn't find any otp for this number. Please request an OTP again.",
          );
        } else if (loginAttempt.attempts > 9) {
          await this.redisService.set(
            `${this.blockedNumbersKey}${mobile}`,
            '1',
            24 * 60 * 60,
          );
          throw new ForbiddenException(
            'You’ve made too many incorrect attempts. Your account is blocked for 24 hrs.',
          );
        } else {
          if (+loginAttempt.otp !== +inputs.otp) {
            await this.redisService.set(
              `${this.attemptsKey}${mobile}`,
              JSON.stringify({
                attempts: loginAttempt.attempts + 1,
                lastOtpActionAt: new Date().getTime(),
                otp: loginAttempt.otp,
              }),
              keyTTL,
            );
            throw new UnauthorizedException('Incorrect OTP entered');
          }
          const mobileToken = randomString(16);
          await this.redisService.set(
            `${this.mobileAuthKey}${mobile}`,
            mobileToken,
            30,
          );
          const {
            data: { resp },
          } = await this.httpService
            .post(this.config.get('services.api.loginWithMobile.url'), {  // what is in 8080 port
              token: mobileToken,
              calling_code: countryCode,
              mobile: phoneNumber,
            })
            .toPromise();
  
          if (resp.code !== 200) {
            if (resp.code === 403 && resp.res === 0) {
              if (inputs.appType === APP_TYPE.FINANCE_INVOICING) {
                const verifyMobileToken = randomString(16);
                const gstValidationToken = randomString(64);
                const mobileNumber = `+91 ${inputs.mobile}`;
  
                await Promise.all([
                  this.redisService.set(
                    `${this.customerVerificationToken}${mobileNumber}`,
                    verifyMobileToken,
                    24 * 60 * 60,
                  ),
                  this.redisService.set(
                    gstValidationToken,
                    JSON.stringify({
                      attempts: 0,
                    }),
                    3 * 60 * 60,
                  ),
                ]);
  
                return {
                  isNewCustomer: 1,
                  phoneNumber: mobileNumber,
                  gstValidationToken,
                };
            //   } else if (inputs.appType === APP_TYPE.SUPPLIER_NATIVE) {
            //     return {
            //       isNewSupplier: 1,
            //     };
            //   }
            }
            return { message: 'There was an error when trying to login' };
          }
          const userId = resp.data.id;
          const promises = [];
          promises.push(this.redisService.del(`${this.attemptsKey}${mobile}`));
  
          if (inputs.deviceId && inputs.deviceToken) {
            const data = {
              userId: userId,
              deviceId: inputs.deviceId,
              deviceToken: inputs.deviceToken,
            };
            // promises.push(
            //   this.notificationProducerService.sendData(
            //     data,
            //     this.userDeviceDetailsQueueUrl,
            //   ),
            // );
          }
  
        //   const whatsappWelcomeMessageBody = {
        //     params: {
        //       userIds: [userId],
        //       actionTakerId: userId,
        //       optInMode: OPTIN_MODES.USER_LOGIN,
        //     },
        //     whatsappNotificationType:
        //       inputs.appType === APP_TYPE.CUSTOMER
        //         ? CUSTOMER_WHATSAPP_NOTIFICATION_TYPES.WELCOME_MESSAGE
        //         : SUPPLIER_WHATSAPP_NOTIFICATION_TYPES.WELCOME_MESSAGE,
        //   };
        //   promises.push(
        //     this.notificationProducerService.sendData(
        //       whatsappWelcomeMessageBody,
        //       this.whatsappNotificationQueueUrl,
        //     ),
        //   );
  
          await Promise.all(promises);
  
          return resp.data;
        }
    }
}

    private async fetchLoginAttempt(
        mobile: string,
      ): Promise<[AttemptData, number]> {
        const [attempt, ttl] = await this.fetchKeyAndTTL(
          `${this.attemptsKey}${mobile}`,
        );
        if (attempt) {
          const data = JSON.parse(attempt);
          return [data, ttl];
        } else {
          return [null, ttl];
        }
      }
  
      private async fetchKeyAndTTL(key: string) {
        return await Promise.all([
          this.redisService.get(key),
          this.redisService.ttl(key),
        ]);
      }

      
    private async checkIsNumberBlocked(mobile: string): Promise<void> {
        const isBlocked = await this.redisService.get(
          `${this.blockedNumbersKey}${mobile}`,
        );
        if (isBlocked) {
          throw new ForbiddenException(
            'You’ve made too many incorrect attempts. Your account is blocked for 24 hrs.',
          );
        }
        return null;
      }
}