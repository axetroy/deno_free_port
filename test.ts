import {
  assert,
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@v1.0.0-rc1/testing/asserts.ts";
import * as path from "https://deno.land/std@v1.0.0-rc1/path/mod.ts";
import { isFreePort, getFreePort } from "./mod.ts";
const { test, run, execPath } = Deno;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

const __filepath = path.normalize(
  import.meta.url.replace("file://", ""),
).replace(/^\\/, "");

console.log(`test filename: ${JSON.stringify(__filepath)}`);

function testWithServer(port: number, fn: () => Promise<void>) {
  test({
    name: fn.name,
    fn: async () => {
      const ps = run({
        stdout: "inherit",
        stderr: "inherit",
        cmd: [
          execPath(),
          "run",
          "--allow-net",
          path.join(path.dirname(__filepath), "testdata", "server.ts"),
          port + "",
        ],
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
    },
  });
}

test({
  name: "GetFreePortIfPortIsFree",
  fn: async () => {
    const port = await getFreePort(10086);

    assert(port);
    assertEquals(typeof port, "number");
    assertEquals(port, 10086);

    assertEquals(await isFreePort(10086), true);
  },
});

testWithServer(10086, async function testGetFreePortIfPortHasBeenToke() {
  const port = await getFreePort(10086);

  assert(port);
  assertEquals(typeof port, "number");
  assertNotEquals(port, 10086);
  assertEquals(await isFreePort(10086), false);
});
