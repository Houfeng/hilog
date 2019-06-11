import { fork } from "child_process";
import { createSocket } from "dgram";
import { localhost } from "../FileWriter/consts";

fork(require.resolve("../FileWriter/Server"));

setTimeout(() => {
  const client = createSocket("udp4");
  client.send("hello", 5969, localhost, (err: any) => {
    if (err) console.log("send err:", err);
  });
}, 2000);
