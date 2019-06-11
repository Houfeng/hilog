import * as os from "os";
import * as util from "util";
import { builtIn } from "./builtIn";
import { IConfigureOptions } from "./IConfigureOptions";
import { IWriter } from "../AbstractWriter/IWriter";
import { Level, LevelWeights } from "./Level";
import { resolve } from "path";
import { WriterConstructor } from "../AbstractWriter/WriterConstructor";

/**
 * 日志类
 */
export class Logger {
  /**
   * 全局选项
   */
  public static options: IConfigureOptions;

  /**
   * 所有启用的 writer 实例列表
   */
  public static writers: IWriter[] = [];

  /**
   * 初始化 Promise 对象
   */
  private static initPromise: Promise<any>;

  /**
   * 初始化 logger 实例
   * @param options 配置选项
   */
  public static async init(options: IConfigureOptions) {
    if (this.initPromise) return this.initPromise;
    this.options = { ...options };
    if (!this.options.root) {
      this.options.root = resolve(process.cwd(), "./logs/");
    }
    const { writers = {}, root } = this.options;
    this.writers = await Promise.all(
      Object.keys(writers).map(async name => {
        const writeConf = writers[name];
        if (!writeConf) return;
        const { type, ...others } = writeConf;
        const Writer = util.isString(type) ? builtIn[type] : type;
        const writerInstance = new Writer({ type, root, ...others }, name);
        await writerInstance.init();
        return writerInstance;
      })
    );
  }

  /**
   * 注册一个 Writer 类，注册后可用 init 方法的配置选项（IConfigureOptions）
   * @param name 注册名称
   * @param writer Writer 类
   */
  public static register(name: string, writer: WriterConstructor) {
    builtIn[name] = writer;
  }

  /**
   * 通过分类名称获取一个 logger 实例
   * @param category 分类
   */
  public static get(category = "default") {
    return new Logger(category);
  }

  /**
   * 构造一个 logger 实例
   * @param category 类别
   */
  constructor(public category = "default") {}

  /**
   * 向日志介质写日志
   * @param level 日志 level
   * @param fields 扩展字段
   * @param dataOrFormatter 输出内容或格式化字符串
   * @param args 插入参数
   */
  public async write(
    level: Level,
    fields?: any,
    dataOrFormatter?: any,
    ...args: any[]
  ) {
    const category = this.category;
    const time = Date.now();
    const pid = process.pid;
    const hostname = os.hostname();
    const data = util.format(dataOrFormatter, ...args);
    const pendings = Logger.writers.map(writer => {
      const { categories = ["*"], level: range = [] } = writer.options;
      if (!categories.includes(category) && !categories.includes("*")) return;
      const weights = LevelWeights;
      const levelBegin = weights[range[0] || Level.debug];
      const levelEnd = weights[range[1] || range[0] || Level.error];
      const levelCrrent = weights[level];
      if (levelCrrent < levelBegin || levelCrrent > levelEnd) return;
      const item = { ...fields, level, category, time, data, pid, hostname };
      return writer.write(item);
    });
    return Promise.all(pendings);
  }

  /**
   * 输出 log 日志
   * @param dataOrFormatter 输出内容或格式化字符串
   * @param args 插入参数
   */
  public debug(dataOrFormatter: any, ...args: any[]) {
    return this.write(Level.debug, null, dataOrFormatter, ...args);
  }

  /**
   * 输出 INFO 日志
   * @param dataOrFormatter 输出内容或格式化字符串
   * @param args 插入参数
   */
  public info(dataOrFormatter: any, ...args: any[]) {
    return this.write(Level.info, null, dataOrFormatter, ...args);
  }

  /**
   * 输出 INFO 日志
   * @param dataOrFormatter 输出内容或格式化字符串
   * @param args 插入参数
   */
  public warn(dataOrFormatter: any, ...args: any[]) {
    return this.write(Level.warn, null, dataOrFormatter, ...args);
  }

  /**
   * 输出 INFO 日志
   * @param dataOrFormatter 输出内容或格式化字符串
   * @param args 插入参数
   */
  public error(dataOrFormatter: any, ...args: any[]) {
    return this.write(Level.error, null, dataOrFormatter, ...args);
  }
}
