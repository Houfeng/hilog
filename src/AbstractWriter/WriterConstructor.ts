import { IWriterOptions } from "./IWriterOptions";
import { IWriter } from "./IWriter";

/**
 * Writer 构造函数
 */
export type WriterConstructor = new (
  options: IWriterOptions,
  name: string
) => IWriter;
