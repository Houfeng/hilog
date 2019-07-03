import { AbstractWriter } from "../AbstractWriter";
import { ILogItem } from "../Logger";
import { logger } from "./logger";

/**
 * 基于控制台(Console)的 Writer
 */
export class ConsoleWriter extends AbstractWriter {
  public async write(logItem: ILogItem) {
    const { level } = logItem;
    const method = String(level);
    return logger[method](this.format(logItem));
  }
}
