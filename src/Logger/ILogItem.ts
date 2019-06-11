import { Level } from "./Level";

/**
 * 日志项接口定义
 */
export interface ILogItem {
  /**
   * 日志级别
   */
  level: Level;

  /**
   * 日志类别
   */
  category: string;

  /**
   * 时间戳
   */
  time: number;

  /**
   * 日志内容
   */
  data: string;

  /**
   * 进程 ID
   */
  pid: number;

  /**
   * 主机名
   */
  hostname: string;

  /**
   * Others
   */
  [key: string]: any;
}
