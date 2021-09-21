import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class EventService {
    public changeUserInfo = new Subject();
    
    constructor() {
    }
}