import { WithId } from "./withId";

export class Consumer extends WithId<number>{
    firstname: string;
    lastname: string;
    nif: number;
    documentID: string;
    deleted: boolean;
    constructor(firstname: string, lastname: string, nif:number, documentID: string, deleted: boolean){
        super();
        this.firstname = firstname;
        this.lastname = lastname;
        this.nif = nif;
        this.documentID = documentID;
        this.deleted = deleted;
    }
}