[![Build Status](https://github.com/axetroy/deno_free_port/workflows/test/badge.svg)](https://github.com/axetroy/deno_free_port/actions)

### get free port for Deno

```ts
import { getFreePort } from "https://deno.land/x/free_port/mod.ts";

// if port 3000 is available. then return or return a random port
console.log(await getFreePort(3000));
```

## License

The [MIT License](LICENSE)
