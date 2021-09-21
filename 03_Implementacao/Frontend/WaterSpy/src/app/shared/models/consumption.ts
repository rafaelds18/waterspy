import { WithId } from "./withId";

export class Consumption extends WithId<number>{
    value: number;
    month?: string;
    date?: Date;
    meterId: number;
    constructor(value: number, month: string, date: Date, meterId: number){
        super();
        this.value = value;
        this.date = date;
        this.meterId = meterId;
        this.month = month;
    }
}