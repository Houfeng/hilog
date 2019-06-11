import * as fs from "fs";
import * as mkdirp from "mkdirp";
import { createServer, Socket } from "net";
import { dirname, resolve } from "path";
import { EOL } from "os";
import { getPort } from "./ports";
import { IFileWriterOptions } from "./IFileWriterOptions";
import { localhost } from "./consts";
import { sleep } from "./sleep";

const { formatDate } = require("ntils");
const split = require("split");
const logsMap: { [name: string]: string[] } = {};
const optionsMap: { [name: string]: IFileWriterOptions } = {};

function parse(data: string) {
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
}

const server = createServer((socket: Socket) => {
  socket.pipe(split()).on("data", (data: string) => {
    if (!data) return;
    const { name, log } = parse(data);
    if (log !== undefined && logsMap[name]) {
      logsMap[name].push(log);
    }
  });
});

server.on("error", () => process.send({ status: false }));
server.on("listening", () => process.send({ status: true }));

async function writeLoop() {
  while (true) {
    await sleep(1000);
    await Promise.all(
      Object.keys(logsMap).map(async name => {
        const options = optionsMap[name];
        const logs = logsMap[name].slice(0);
        logsMap[name].length = 0;
        if (!logs || logs.length < 1) return;
        return writeLogs(options, logs);
      })
    );
  }
}

async function createDir(dirPath: string) {
  return new Promise((resolve, reject) => {
    mkdirp(dirPath, err => (err ? reject(err) : resolve(dirPath)));
  });
}

async function writeLogs(options: IFileWriterOptions, logs: string[]) {
  const { location, root } = options;
  const logFile = resolve(root, formatDate(new Date(), location));
  const logDir = dirname(logFile);
  if (!fs.existsSync(logDir)) await createDir(logDir);
  return appendFile(logFile, logs.join(EOL) + EOL);
}

async function appendFile(filename: string, data: any) {
  return new Promise<any>((resolve, reject) => {
    fs.appendFile(filename, data, err => (err ? reject(err) : resolve()));
  });
}

process.on("message", message => {
  const { name, options } = message;
  if (name && options !== undefined) {
    optionsMap[name] = options;
    logsMap[name] = logsMap[name] || [];
  }
});

(async () => {
  const port = await getPort();
  server.listen(port, localhost);
  writeLoop();
})();
