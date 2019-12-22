const port = parseInt(Deno.args[1]) as number;

const listener = Deno.listen({ port });

console.log(`http://localhost:${port}/`);

while (true) {
  const connection = await listener.accept();
  console.log(connection);
}
