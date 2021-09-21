import { WithId } from './withId';
export class ConsultConsumptions extends WithId<number>{
    contractNumber: number;
    meterNumber: number;
    month: string;
    date: Date;
    value: number;
}