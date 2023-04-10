import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CommonService {
  constructor(
    private config: ConfigService,
    private httpsService: HttpService,
  ) {}

  async getCustomerdata(id: number): Promise<any> {
    const dataProviderConfig = this.config.get('dataProvider');
    // console.log(dataProviderConfig);
    const {
      api: { getCustomerData },
      headers,
    } = dataProviderConfig;
    const method = getCustomerData.method;

    const url = getCustomerData.url.replace(':customerId', id);
    console.log(url);

    console.log('im here get customer data');
    const result = await this.httpsService
      .request({ method: method, url: url })
      .toPromise();

    return result.data;
  }
  async getUserdata(id: number): Promise<any> {
    const dataProviderConfig = this.config.get('dataProvider');
    // console.log(dataProviderConfig);
    const {
      api: { getUserData },
      headers,
    } = dataProviderConfig;
    const method = getUserData.method;

    const url = getUserData.url.replace(':userId', id);
    console.log(url);

    console.log('im here get user data ');
    const result = await this.httpsService
      .request({ method: method, url: url })
      .toPromise();

    return result.data;
  }
}
