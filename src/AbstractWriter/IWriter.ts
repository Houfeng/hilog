import { ILogItem } from "../Logger/ILogItem";
import { IWriterOptions } from "./IWriterOptions";

/**
 * Writer 接口
 */
export interface IWriter {
  /**
   * 构造一个 Writer
   * @param options Writer 选项
   */
  options: IWriterOptions;

  /**
   * writer 名称
   */
  name: string;

  /**
   * 初始化 Writer
   */
  init(): Promise<any>;

  /**
   * 写入一条日志
   * @param logItem 日志项
   */
  write(logItem: ILogItem): Promise<any>;
}
