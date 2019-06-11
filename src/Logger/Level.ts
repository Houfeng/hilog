/**
 * 日志级别
 */
export enum Level {
  /**
   * DEBUG 日志
   */
  debug = "debug",

  /**
   * INFO 日志
   */
  info = "info",

  /**
   * WARN 日志
   */
  warn = "warn",

  /**
   * ERROR 日志
   */
  error = "error"
}

/**
 * 日志级别权重
 */
export enum LevelWeights {
  /**
   * LOG 权重
   */
  debug = 100,

  /**
   * INFO 权重
   */
  info = 200,

  /**
   * WARN 权重
   */
  warn = 300,

  /**
   * ERROR 权重
   */
  error = 400
}
