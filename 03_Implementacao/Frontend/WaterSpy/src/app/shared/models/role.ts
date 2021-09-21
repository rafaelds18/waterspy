import { WithId } from "./withId";

export class Role extends WithId<number>{
    description: string;
    constructor(description: string){
        super();
        this.description = description;
    }
}