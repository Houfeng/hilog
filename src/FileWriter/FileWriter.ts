import { AbstractWriter } from "../AbstractWriter";
import { ILogItem } from "../Logger";
import { IFileWriterOptions } from "./IFileWriterOptions";
import { LogClient } from "./Client";

/**
 * 基于文件系统的的 Writer
 */
export class FileWriter extends AbstractWriter<IFileWriterOptions> {
  /**
   * 日志 client 实例
   */
  protected client: LogClient;

  /**
   * 初始化 File Writer
   */
  public async init(): Promise<any> {
    this.client = new LogClient();
    await this.client.init(this.options, this.name);
  }

  /**
   * 写入日志
   * @param logItem 日志项
   */
  public async write(logItem: ILogItem) {
    if (!this.client) return;
    return this.client.send(this.format(logItem));
  }
}
