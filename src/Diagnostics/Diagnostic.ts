import {DiagnosticSeverity} from './DiagnosticSeverity';

/** Class to handle any information, warning, error, or hint to the end user */
export class Diagnostic {
  /**
   * Constructor
   * @param {number} start Start position of the diagnostic
   * @param {number} end End position of the diagnostic
   * @param {string} message Message of the diagnostic
   * @param {DiagnosticSeverity} severity Severity of the diagnostic
   */
  constructor(
    public start: number,
    public end: number,
    public message: string,
    public severity: DiagnosticSeverity) {}
}
