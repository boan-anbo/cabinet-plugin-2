import {Component, OnInit} from '@angular/core';
import {VscodeStateService} from "../services/vscode-state.service";
import {VscodeControlService} from "../services/vscode-control.service";
import {SelfCheckService} from "../services/self-check.service";

@Component({
  selector: 'app-health-check',
  templateUrl: './health-check.component.html',
  styleUrls: ['./health-check.component.css']
})
export class HealthCheckComponent implements OnInit {

  constructor(
    public vscodeStates: VscodeStateService,
    public vscodeControl: VscodeControlService,
    public selfCheck: SelfCheckService,
  ) {
  }

  ngOnInit(): void {
  }

  getTestEntries(): { value: boolean; key: string }[] {
    const entries = this.vscodeStates.checkEntries;
    const keys = Object.keys(entries);
    const values = Object.values(entries);
    const result = keys.map((key, index) => {
        return {
          key: key,
          value: values[index]
        }
      }
    )
    return result;
  }
}
