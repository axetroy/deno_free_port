[![Build Status](https://github.com/axetroy/deno_free_port/workflows/test/badge.svg)](https://github.com/axetroy/deno_free_port/actions)

### get free port for Deno

```ts
// Requires `--allow-net` flag
import {
  isFreePort,
  getFreePort,
} from 'https://deno.land/x/free_port@v1.2.0/mod.ts'

// if port 3000 is available. then return or return a random port
console.log(await getFreePort(3000)) // 3000 or random port
console.log(await isFreePort(3000)) // true or false
```

## License

The [MIT License](LICENSE)
