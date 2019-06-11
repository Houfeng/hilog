import { ChildProcess, fork } from "child_process";
import { EOL } from "os";
import { getPort } from "./ports";
import { IFileWriterOptions } from "./IFileWriterOptions";
import { localhost } from "./consts";
import { sleep } from "./sleep";
import { Socket } from "net";

const serverFile = require.resolve("./Server");
const childExecArgv = (process.execArgv || []).map(flag =>
  flag.includes("--inspect") ? "--inspect=0" : flag
);

export class LogClient {
  /**
   * 日志 Server 进程
   */
  protected serverProcess: ChildProcess;

  /**
   * log server 进程启动 promise
   */
  protected starting: Promise<boolean>;

  /**
   * 启动日志 Server
   */
  protected startServer = () => {
    if (this.starting) return this.starting;
    const errorHandler = (resolve?: Function) => {
      this.serverProcess.kill("SIGKILL");
      this.serverProcess = null;
      this.starting = null;
      if (resolve) resolve(false);
    };
    const successHandler = async (resolve?: Function) => {
      await this.serverProcess.send({ options: this.options, name: this.name });
      if (resolve) resolve(true);
    };
    this.starting = new Promise<boolean>(resolve => {
      this.serverProcess = fork(serverFile, [], { execArgv: childExecArgv });
      this.serverProcess.on("message", ({ status }: any) => {
        return status ? successHandler(resolve) : errorHandler(resolve);
      });
    });
    return this.starting;
  };

  /**
   * 连接 Log Server 的 socket 实例
   */
  protected socket: Socket;

  /**
   * 连接中的 promise
   */
  protected connecting: Promise<boolean>;

  /**
   * 是否已连接
   */
  protected connected = false;

  /**
   * 连接次数
   */
  protected connectCount = 0;

  /**
   * 连接到 server
   */
  protected connectServer = async () => {
    if (this.connecting) return this.connecting;
    this.connected = false;
    this.socket = new Socket();
    const port = await getPort();
    const errorHandler = (resolve?: Function) => {
      this.connected = false;
      this.connecting = null;
      this.socket.destroy();
      this.socket = null;
      if (resolve) resolve(false);
    };
    this.connecting = new Promise<boolean>(resolve => {
      this.socket.on("error", () => errorHandler(resolve));
      this.socket.on("timeout", () => () => errorHandler(resolve));
      this.socket.on("connect", () => {
        this.connected = true;
        this.connectCount++;
        resolve(true);
      });
      this.socket.on("close", () => {
        this.connected = false;
        if (this.connectCount > 0) this.startAndConnectServer();
      });
      this.socket.connect(port, localhost);
    });
    return this.connecting;
  };

  /**
   * 启动或连接到 log server
   */
  protected startAndConnectServer = async () => {
    const status = await this.connectServer();
    if (status) return status;
    await this.startServer();
    return this.connectServer();
  };

  /**
   * 尝试连接 log sever
   */
  protected tryConnectServer = async (times = 5, delay = 1000) => {
    for (let i = 0; i < times; i++) {
      if (await this.startAndConnectServer()) return true;
      await sleep(delay);
    }
    return false;
  };

  /**
   * 发送消息
   * @param message 消息体
   */
  private sendMessage(message: any) {
    if (!this.connected) return;
    message.name = this.name;
    return new Promise<any>((resolve, reject) => {
      this.socket.write(JSON.stringify(message) + EOL, err => {
        return err ? reject(err) : resolve(message);
      });
    });
  }

  /**
   * 选项
   */
  protected options: IFileWriterOptions;
  protected name: string;

  /**
   * 初始化 client
   */
  public init = async (options: IFileWriterOptions, name: string) => {
    this.options = { location: "./yyyy-MM-dd.log", ...options };
    this.name = name;
    await this.tryConnectServer();
    if (!this.connected) throw new Error("Conntect Log server error");
  };

  /**
   * 发送日志
   */
  public send = async (log: string): Promise<void> => {
    return this.sendMessage({ log });
  };
}
