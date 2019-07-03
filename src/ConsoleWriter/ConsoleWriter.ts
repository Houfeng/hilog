import { AbstractWriter, IWriterOptions } from "../AbstractWriter";
import { ILogItem } from "../Logger";
import { logger } from "./logger";

/**
 * 基于控制台(Console)的 Writer
 */
export class ConsoleWriter extends AbstractWriter {
  constructor(public options: IWriterOptions, public name: string) {
    super(options, name);
    this.options = {
      format: "[{level}] {category} - {data} {hostname} #{pid}",
      ...options
    };
  }

  public async write(logItem: ILogItem) {
    const { level, time } = logItem;
    const method = String(level);
    return logger[method](time, this.format(logItem));
  }
}
