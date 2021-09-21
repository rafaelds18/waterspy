import { WithId } from "./withId";

export class Notification extends WithId<number>{
    content: string;
    date: Date;
    notificationType: string;
    supplierName?: string;
    constructor(content: string, date: Date, notificationType: string, supplierName?: string){
        super();
        this.content = content;
        this.date = date;
        this.notificationType = notificationType
        this.supplierName = supplierName;
    }
}