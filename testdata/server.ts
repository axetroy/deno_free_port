const port = parseInt(Deno.args[0]) as number;

const listener = Deno.listen({ port });

console.log(`Listen on port ${port}`);

while (true) {
  const connection = await listener.accept();
  console.log(connection);
}
