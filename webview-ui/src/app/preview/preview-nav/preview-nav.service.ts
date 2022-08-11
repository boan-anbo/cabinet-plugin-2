import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreviewNavService {
  allowNavToScrollWithPreview = true;
  /**
   * Storing current preview nav entries in viewport
   * string format: `nav-line-${line-number}`
   */
  navLinesInViewPort: Set<string> = new Set();
  constructor() { }
}
