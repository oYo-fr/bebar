import {Diagnostic} from './Diagnostic';
import {DiagnosticSeverity} from './DiagnosticSeverity';

/** Class to handle any information, warning, error, or hint to the end user */
export class DiagnosticBag {
  public static Diagnostics: Diagnostic[] = [];

  /** Clears all diagostics */
  public static clear() {
    DiagnosticBag.Diagnostics = [];
  }

  /**
   * Adds a new diagnostic into the bag
   * @param {number} startLine Start line of the diagnostic
   * @param {number} startColumn Start column of the diagnostic
   * @param {number} endLine End line of the diagnostic
   * @param {number} endColumn End column of the diagnostic
   * @param {string} message Message of the diagnostic
   * @param {DiagnosticSeverity} severity Severity of the diagnostic
   * @param {string} file The file where the error is
   */
  public static add(
      startLine: number,
      startColumn: number,
      endLine: number,
      endColumn: number,
      message: string,
      severity: DiagnosticSeverity,
      file: string) {
    DiagnosticBag.Diagnostics.push(
        new Diagnostic(startLine, startColumn, endLine, endColumn, message, severity, file));
  }

  /**
   * Adds a new diagnostic into the bag
   * @param {string} source The source for whish we have to compute the real position
   * @param {number} start Start line of the diagnostic
   * @param {number} end End line of the diagnostic
   * @param {string} message Message of the diagnostic
   * @param {DiagnosticSeverity} severity Severity of the diagnostic
   * @param {string} file The file where the error is
   */
  public static addByPosition(
      source: string,
      start: number,
      end: number,
      message: string,
      severity: DiagnosticSeverity,
      file: string) {
    const substringStart = source.substring(0, start);
    const linesStart = substringStart.split('\n');
    const substringEnd = source.substring(0, end);
    const linesEnd = substringEnd.split('\n');

    DiagnosticBag.Diagnostics.push(
        new Diagnostic(
            linesStart.length, linesStart[linesStart.length-1].length,
            linesEnd.length, linesEnd[linesEnd.length-1].length,
            message, severity, file));
  }
}
