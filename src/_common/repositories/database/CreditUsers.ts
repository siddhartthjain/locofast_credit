import { CreditUser } from "src/common/models/CreditUsers";
import { DatabaseRepository, InjectModel } from "src/core";


export class CreditUserRepository extends DatabaseRepository
{

    @InjectModel(CreditUser)
    model: CreditUser;
 // function1
 //function....
}
