import { WithId } from "./withId";

export class Supplier extends WithId<number>{
    name: string;
    tin: number;
    deleted: boolean;
    constructor(name: string, tin: number, deleted: boolean){
        super();
        this.name = name;
        this.tin = tin;
        this.deleted = deleted;
    }
}