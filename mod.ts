export interface getFreePortOption {
  hostname?: string;
  transport?: "tcp";
}

function random(min: number, max: number): number {
  return Math.round(Math.random() * (max - min)) + min;
}

/**
 * Determine if a port is available for using
 * Requires `--allow-net` flag
 * @param port  The port number to find:
 *              0 - 1023 WellKnownPorts
 *              1024 - 49151 RegisteredPorts
 *              49152 - 65535 Dynamicand/orPrivatePorts
 * @param options
 */
export async function isFreePort(
  port: number,
  options: getFreePortOption = {}
): Promise<boolean> {
  try {
    const listener = await Deno.listen({
      port: port,
      hostname: options.hostname,
      transport: options.transport
    });

    listener.close();

    return true;
  } catch (err) {
    if (err instanceof Deno.DenoError) {
      if (err.kind === Deno.ErrorKind.AddrInUse) {
        return false;
      }
    }

    throw err;
  }
}

/**
 * Found free port.
 * If the port is not available, returns the port
 * If the port is not available, returns a random available port
 * Requires `--allow-net` flag
 * @param port  The port number to find:
 *              0 - 1023 WellKnownPorts
 *              1024 - 49151 RegisteredPorts
 *              49152 - 65535 Dynamicand/orPrivatePorts
 * @param options
 */
export async function getFreePort(
  port: number,
  options: getFreePortOption = {}
): Promise<number> {
  try {
    const listener = await Deno.listen({
      port: port,
      hostname: options.hostname,
      transport: options.transport
    });

    listener.close();

    return port;
  } catch (err) {
    if (err instanceof Deno.DenoError) {
      if (err.kind === Deno.ErrorKind.AddrInUse) {
        const newPort =
          port <= 1023
            ? random(0, 1023)
            : port <= 49151
            ? random(1024, 49151)
            : random(49152, 65535);
        return getFreePort(newPort, options);
      }
    }

    throw err;
  }
}
