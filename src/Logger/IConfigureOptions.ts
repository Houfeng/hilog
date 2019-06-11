import { IWriterInfo } from "../AbstractWriter/IWriterInfo";

/**
 * Logger 全局配置选项
 */
export interface IConfigureOptions {
  /**
   * 日志的根路径（resolve 日志文件路径时会用到）
   */
  root?: string;

  /**
   * 声明启用的 Writers，只有符合规则的 logItem 才会被写入
   */
  writers: { [name: string]: IWriterInfo };
}
