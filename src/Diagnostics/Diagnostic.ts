import {DiagnosticSeverity} from './DiagnosticSeverity';

/** Class to handle any information, warning, error, or hint to the end user */
export class Diagnostic {
  /**
   * Constructor
   * @param {number} startLine Start line of the diagnostic
   * @param {number} startColumn Start column of the diagnostic
   * @param {number} endLine End line of the diagnostic
   * @param {number} endColumn End column of the diagnostic
   * @param {string} message Message of the diagnostic
   * @param {DiagnosticSeverity} severity Severity of the diagnostic
   */
  constructor(
    public startLine: number,
    public startColumn: number,
    public endLine: number,
    public endColumn: number,
    public message: string,
    public severity: DiagnosticSeverity) {}
}
