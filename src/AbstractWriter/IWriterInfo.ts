import { IWriterOptions } from "./IWriterOptions";
import { WriterConstructor } from "./WriterConstructor";

/**
 * Writer 信息
 */
export interface IWriterInfo extends IWriterOptions {
  /**
   * Writer 类别
   */
  type: string | WriterConstructor;
}
