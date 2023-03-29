import { CreditUser } from "@app/_common/models/CreditUsers";
import { DatabaseRepository, InjectModel } from "@libs/core";




export class CreditUserRepository extends DatabaseRepository
{

    @InjectModel(CreditUser)
    model: CreditUser;
 // function1
 //function....
}
