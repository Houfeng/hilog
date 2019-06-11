import { IWriterOptions } from "../AbstractWriter";
/**
 * 文件 Writer 选项
 */
export interface IFileWriterOptions extends IWriterOptions {
  /**
   * 存储位置
   */
  location: string;
}
