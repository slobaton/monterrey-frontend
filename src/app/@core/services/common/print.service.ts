import { Injectable } from '@angular/core';
import printJS from 'print-js';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor() { }

  public printPdf(pdfUrl: string, callbackFn: () => void) {
    printJS({
      printable: pdfUrl, 
      type: 'pdf',
      onLoadingEnd: callbackFn
    });
  }
}
