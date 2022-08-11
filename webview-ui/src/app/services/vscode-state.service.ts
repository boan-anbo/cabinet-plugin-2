import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {PreviewState} from "../types/preview-state";

@Injectable({
  providedIn: 'root'
})
export class VscodeStateService {

  previewState: BehaviorSubject<PreviewState> = new BehaviorSubject<PreviewState>(PreviewState.WAITING_FOR_DATA);
  public currentDocumentUri: BehaviorSubject<string> = new BehaviorSubject<string>('NONE');
  public currentActiveLine: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);

  /**
   * For checking whether the following command can be communicated to vscode. After receiving test resports, @{radioService} will populate this.
   */
  public checkEntries: Record<string, boolean> = {
    }

  constructor() { }
}
