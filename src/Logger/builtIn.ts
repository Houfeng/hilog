import { ConsoleWriter } from "../ConsoleWriter";
import { FileWriter } from "../FileWriter";
import { WriterConstructor } from "../AbstractWriter/WriterConstructor";

/**
 * 内建 Writer Map
 */
export const builtIn: { [name: string]: WriterConstructor } = {
  /**
   * 基于控制台的 Writer
   */
  console: ConsoleWriter,

  /**
   * 基于文件系统的 Writer
   */
  file: FileWriter
};
