import { Supplier } from './supplier';
import { User } from './user';
import { WithId } from "./withId";

export class Contract extends WithId<number>{
    contractNumber: number;
    description: string;
    deleted?: boolean;
    supplierId: number;
    supplier?: Supplier;
    users?: Array<User>;
    constructor(contractNumber: number, description: string, deleted: boolean, supplierId: number){
        super();
        this.contractNumber = contractNumber;
        this.description = description;
        this.deleted = deleted;
        this.supplierId = supplierId;
    }
}