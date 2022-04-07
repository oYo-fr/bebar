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
   * @param {number} start Start position of the diagnostic
   * @param {number} end End position of the diagnostic
   * @param {string} message Message of the diagnostic
   * @param {DiagnosticSeverity} severity Severity of the diagnostic
   */
  public static add(
      start: number,
      end: number,
      message: string,
      severity: DiagnosticSeverity) {
    DiagnosticBag.Diagnostics.push(
        new Diagnostic(start, end, message, severity));
  }
}
