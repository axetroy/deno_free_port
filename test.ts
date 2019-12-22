import {
  assert,
  assertEquals,
  assertNotEquals
} from "https://deno.land/std@v0.27.0/testing/asserts.ts";
import { runIfMain, test } from "https://deno.land/std@v0.27.0/testing/mod.ts";
import { getFreePort } from "./mod.ts";
const { run, execPath } = Deno;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

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
          "./testdata/server.ts",
          port + ""
        ]
      });

      await sleep(2000);

      let err: Error;
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
  assert(typeof port === "number");
  assertEquals(port, 10086);
});

testWithServer(10086, async function testGetFreePort() {
  const port = await getFreePort(10086);
  assert(port);
  assertEquals(typeof port, "number");
  assertNotEquals(port, 10086);
});

runIfMain(import.meta);
