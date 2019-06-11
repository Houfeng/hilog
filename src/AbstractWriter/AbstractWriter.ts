import { ILogItem } from "../Logger/ILogItem";
import { IWriterOptions } from "./IWriterOptions";
import { IWriter } from "./IWriter";

const DEFAULT_FORMAT = "[:time] [:level] :category - :data :hostname #:pid";

/**
 * 抽象 Writer 基类
 */
export class AbstractWriter<T extends IWriterOptions = IWriterOptions>
  implements IWriter {
  /**
   * 构造一个 Writer
   * @param options Writer 选项
   */
  constructor(public options: T, public name: string) {
    this.options = { ...options };
  }

  /**
   * 初始化 Writer
   */
  public async init(): Promise<any> {}

  /**
   * 写入一条日志
   * @param logItem 日志项
   */
  public async write(logItem: ILogItem): Promise<any> {}

  /**
   * 格式化日志项为字符串
   * @param logItem 日志项
   */
  protected format(logItem: ILogItem) {
    let text = this.options.format || DEFAULT_FORMAT;
    Object.keys(logItem).forEach(key => {
      const value = logItem[key];
      const formatedValue =
        key === "time" ? new Date(value).toLocaleString() : value;
      text = text.replace(`:${key}`, formatedValue);
    });
    return text;
  }
}
