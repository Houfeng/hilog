import { PORT_KEY } from "./consts";

const oneport = require("oneport");

export function acquire() {
  return new Promise<number>((resolve, reject) => {
    oneport.acquire(PORT_KEY, (err: Error, port: number) => {
      return err ? reject(err) : resolve(port);
    });
  });
}

export function last() {
  return new Promise<number>((resolve, reject) => {
    oneport.last(PORT_KEY, (err: Error, port: number) => {
      return err ? reject(err) : resolve(port);
    });
  });
}

export async function getPort() {
  try {
    const port = await last();
    return port;
  } catch {
    return acquire();
  }
}
