import { AbstractWriter } from "../AbstractWriter";
import { ILogItem, Level } from "../Logger";

const console = require("console3");

/**
 * 基于控制台(Console)的 Writer
 */
export class ConsoleWriter extends AbstractWriter {
  public async write(logItem: ILogItem) {
    const { level } = logItem;
    const method = level === Level.debug ? "log" : String(level);
    return console[method](this.format(logItem));
  }
}
