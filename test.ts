import {
  assert,
  assertEquals,
  assertNotEquals
} from "https://deno.land/std@v0.35.0/testing/asserts.ts";
import * as path from "https://deno.land/std@v0.35.0/path/mod.ts";
import { isFreePort, getFreePort } from "./mod.ts";
const { test, run, execPath } = Deno;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

const __filepath = import.meta.url.replace("file://", "");

console.log("test filename:", __filepath);

function testWithServer(port: number, fn: () => Promise<void>) {
  test({
    name: fn.name,
    fn: async () => {
      const ps = run({
        stdout: "inherit",
        stderr: "inherit",
        args: [
          execPath(),
          "run",
          "--allow-net",
          path.join(path.dirname(__filepath), "testdata", "server.ts"),
          port + ""
        ]
      });

      await sleep(5000);

      let err!: Error;
      try {
        fn();
      } catch (e) {
        err = e;
      } finally {
        ps.close();
      }

      if (err) {
        throw err;
      }
    }
  });
}

test(async function testGetFreePort() {
  const port = await getFreePort(10086);

  assert(port);
  assertEquals(typeof port, "number");
  assertEquals(port, 10086);

  assertEquals(await isFreePort(10086), true);
});

testWithServer(10086, async function testGetFreePort() {
  const port = await getFreePort(10086, {});

  assert(port);
  assertEquals(typeof port, "number");
  assertNotEquals(port, 10086);
  assertEquals(await isFreePort(10086), false);
});
