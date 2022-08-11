import {Injectable} from '@angular/core';
import {ScrollToConfigOptions, ScrollToService} from "@nicky-lenaers/ngx-scroll-to";
import {MarkdownPoint} from "cabinet-node";
import {NGXLogger} from "ngx-logger";

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  constructor(private scrollToService: ScrollToService
    ,
              private logger: NGXLogger) {
  }


  private scrollTo(line: number) {

    const config: ScrollToConfigOptions = {
      target: 'line-' + line,
      duration: 0,
      offset: -150,

    };
    this.logger.debug('scrollTo', config);
    this.scrollToService.scrollTo(config);
  }

  scrollToPoint(point: MarkdownPoint) {


    this.scrollTo(point.line);

  }

  scrollToLine(line: number) {
    this.scrollTo(line);
  }

  scrollToId(elementId: string, offset?: number, duration?: number) {
    const config: ScrollToConfigOptions = {
      target: elementId,
      duration: 0,
      offset: offset ?? -150,

    };
    this.logger.debug('scrollTo', config);
    this.scrollToService.scrollTo(config);
  }
}
