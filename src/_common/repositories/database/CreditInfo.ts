import { CreditInfo } from "@app/_common/models/CreditInfo";
import { DatabaseRepository, InjectModel } from "@libs/core";
import { Injectable } from "@nestjs/common";

@Injectable()

export class CreditInfoRepo extends DatabaseRepository implements CreditInfoRepo
{
    @InjectModel(CreditInfo)
    model: CreditInfo; 
}