import { Contract } from "./contract";
import { Role } from "./role";
import { WithId } from "./withId";

export class User extends WithId<number>{
    email?: string;
    firstName: string;
    lastName: string;
    imageName: string;
    image: any;
    imageType?: string;
    password: string;
    emailConfirmed?: boolean;
    deleted?: number;
    createdOn?: Date;
    createdBy?: string;
    updatedOn?: Date;
    updatedBy?: string;
    version?: number;
    roles?: Array<Role>;
    contracts?: Array<Contract>;
    
    constructor(email?: string) {
        super();
        this.email = email;
    }

}