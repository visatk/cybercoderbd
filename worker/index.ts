export interface Env {
  // Define your bindings here (e.g., KV namespaces, D1 databases, R2 buckets)
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    
    // Only accept GET requests for this simple endpoint
    if (request.method !== "GET") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    return new Response("Hello World!", {
      status: 200,
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
        "Cache-Control": "no-store", // Prevents unwanted caching during testing
      },
    });
  },
} satisfies ExportedHandler<Env>;
