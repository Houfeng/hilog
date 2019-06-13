import { Logger } from "../";
import { Level } from "../Logger";

(async () => {
  await Logger.init({
    writers: {
      error: {
        type: "file",
        location: "error-{yyyy-MM-dd}.log",
        categories: ["default"],
        level: [Level.error]
      },
      console: {
        type: "console",
        categories: ["default"],
        level: [Level.debug, Level.error]
      }
    }
  });
  Logger.get().debug("你好%s", "中国");
  Logger.get().info("你好%s", "中国");
  Logger.get().warn("你好%s", "中国");
  Logger.get().error("你好%s", "中国");
})();
