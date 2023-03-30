import { InvoicingUser } from "@app/_common/models/InvoicingUsers";
import { DatabaseRepository, InjectModel } from "@libs/core";




export class InvoicingUserRepository extends DatabaseRepository
{

    @InjectModel(InvoicingUser)
    model: InvoicingUser;
 // function1
 //function....
}
