import { CreditCustomer } from "src/_common/models/CreditCustomer";
import { DatabaseRepository, InjectModel } from "@libs/core/db/"
import { CreditCustomerContract } from "../contracts/CreditCustomer";



export class CreditCustomerRepository extends DatabaseRepository implements CreditCustomerContract
{
  
  @InjectModel(CreditCustomer)
    model: CreditCustomer;

  async getCreditInfo(id: any):  Promise<Array<Record<string, any>>>  {
    
    return await CreditCustomer.query().withGraphFetched('fabric_order').where("id", id);
  }

  //function2
  //function3
  //function...
}