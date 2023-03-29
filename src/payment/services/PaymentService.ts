import { LfRootService } from '@app/_common';
import { BaseValidator } from '@libs/core/validator';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ORG_RAZORPAY_CUSTOMERS } from '../constants';
import { OrgRazorpayCustomersContract } from '../repositories';

@Injectable()
export class PaymentService {
  constructor(
    private validator: BaseValidator,
    @Inject(ORG_RAZORPAY_CUSTOMERS)
    private orgRpzCustomers: OrgRazorpayCustomersContract,
    @Inject(forwardRef(() => LfRootService))
    private locofastrootService: LfRootService,
  ) {}

  async getVpaDetails(
    inputs: Record<string, any>,
  ): Promise<Record<string, any>> {
    const [orgDetails] = await this.locofastrootService.getOrgUserDetails([
      inputs.orgId,
    ]);

    if (orgDetails && orgDetails.isInternational) {
      return {
        locofastrootId: orgDetails.orgId,
        bankAccountDetails: {
          ifsc: 'ICIC0006294',
          name: 'Locofast Online Services Private Limited',
          bankName: 'ICICI Bank A/C',
          accountNumber: '629405500782',
          swiftCode: 'ICICINBBCTS',
          branch: 'NEHRU PLACE Branch',
        },
      };
    }

    return this.orgRpzCustomers.getOrgVpaDetails(inputs.orgId);
  }
}
