import { InvoicingRoot } from "@app/_common/models/InvoicingRoot";
import { DatabaseRepository, InjectModel } from "@libs/core/db/"
import { InvoicingRootContract } from "../contracts/InvoicingRoot";



export class InvoicingRootRepository extends DatabaseRepository implements InvoicingRootContract
{
  
  @InjectModel(InvoicingRoot)
    model: InvoicingRoot;

  async getCreditInfo(id: any):  Promise<Array<Record<string, any>>>  {
    
    return await InvoicingRoot.query().withGraphFetched('fabric_order').where("id", id);
  }

  //function2
  //function3
  //function...
}