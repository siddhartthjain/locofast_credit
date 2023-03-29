import { RepositoryContract } from "@libs/core";


export interface CreditCustomerContract extends RepositoryContract
{
   getCreditInfo(id):  Promise<Array<Record<string, any>>> ;
}