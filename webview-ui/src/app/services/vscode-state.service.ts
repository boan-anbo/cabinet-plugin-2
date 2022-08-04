import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VscodeStateService {

  public currentDocumentUri: BehaviorSubject<string> = new BehaviorSubject<string>('NONE');
  constructor() { }
}
