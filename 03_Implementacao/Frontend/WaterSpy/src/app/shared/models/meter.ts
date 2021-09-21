import { stringify } from "@angular/compiler/src/util";
import { WithId } from "./withId";

export class Meter extends WithId<number>{
    meterNumber: string;
    valInitMeter: number;
    deleted: boolean;
    contractId: number;
    constructor(meterNumber: string, valInitMeter: number, deleted: boolean, contractId: number){
        super();
        this.meterNumber = meterNumber;
        this.valInitMeter = valInitMeter;
        this.deleted = deleted;
        this.contractId = contractId;
    }
}