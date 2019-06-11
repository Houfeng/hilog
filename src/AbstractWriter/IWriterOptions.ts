import { Level } from "../Logger/Level";

/**
 * Writer 选项
 */
export interface IWriterOptions {
  /**
   * 日志类别
   */
  categories?: string[];

  /**
   * 日志级别 [begin,end]
   */
  level?: Level[];

  /**
   * 日志项格式化字符串
   */
  format?: string;

  /**
   * 其实选项
   */
  [name: string]: any;
}
