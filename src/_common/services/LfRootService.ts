import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LfRootContract } from '../repositories';
import { LF_ROOT_REPOSITORY } from '../constants';
import { AuthUserDTO } from '../interfaces';

@Injectable()
export class LfRootService {
  constructor(
    @Inject(LF_ROOT_REPOSITORY) private users: LfRootContract,
    private readonly configService: ConfigService,
  ) {}

  async findById(id: number): Promise<Record<string, any>> {
    return this.users.firstWhere({ id });
  }

  getConfig(user: AuthUserDTO) {
    const supplierAdminId = this.configService.get('auth.supplierAdminId');
    return {
      supplierAdminId,
      isSupplierAdmin: supplierAdminId === user.uid,
    };
  }

  getAppConfig(inputs) {
    const appVersionConfig = this.configService.get(
      'settings.customerAppConfig',
    );
    const versionName = appVersionConfig[inputs.platform];

    if (versionName === inputs.versionName) return null;
    const [appMajor, appMinor] = versionName.split('.');
    if (/^[0-9]+.[0-9]+.[0-9]+$/.test(inputs.versionName)) {
      const [major, minor] = inputs.versionName.split('.');
      if (+appMinor > +minor || +appMajor > +major) {
        return 'hard';
      } else {
        return 'soft';
      }
    }
    return null;
  }

  async getOrgUserDetails(
    orgIds: Array<number>,
  ): Promise<Record<string, any>[]> {
    return this.users.getOrgUserDetails(orgIds);
  }
}
