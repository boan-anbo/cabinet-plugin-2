import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Card, MarkdownPoint, CardConvert} from "cabinet-node";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class PreviewService {
  testMessage = new BehaviorSubject<string>("");

  constructor(
    private httpClient: HttpClient,
  ) {
  }


  testInput: MarkdownPoint[] = []

  loadTestInput() {
    this.httpClient.get("assets/test/md-structure.json").subscribe(data => {
      const rawPojo = data as MarkdownPoint[]
      this.testInput = rawPojo.map(rawPoint => {

        // insert five times the same card

        rawPoint.cards = rawPoint.cards.map(rawCard => {
          // @ts-ignore
          return [rawCard[0], CardConvert.fromApiCard(rawCard[1])]
        });
        return new MarkdownPoint(rawPoint)
      });

      this.testInput = [...this.testInput, ...this.testInput, ...this.testInput, ...this.testInput, ...this.testInput]

    })
    // load json file from angular asset folder
    // https://stackoverflow.com/questions/41006163/how-tddo-load-json-file-from-angular-asset-folder

  }
}
