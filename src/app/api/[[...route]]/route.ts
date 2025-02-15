import { Hono } from "hono";
import { handle } from "hono/vercel";
import { z } from "zod";
import { describeRoute } from "hono-openapi";
// You can import these for your preferred validation library
import { resolver, validator as vValidator } from "hono-openapi/zod";
import { openAPISpecs } from "hono-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { auth } from "@/server/lib/auth"; // path to your auth file
import user from "@/server/routes/user"; // path to your user file

declare module "hono" {
  interface ContextVariableMap {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  }
}

export const runtime = "edge";

const app = new Hono().basePath("/api");

const querySchema = z.object({
  name: z.string(),
});

app
  .use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
  })
  .on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw))
  .get(
    "/hello",
    describeRoute({
      description: "Say hello to the user",
      responses: {
        200: {
          description: "Successful response",
          content: {
            "text/plain": { schema: resolver(z.string()) },
          },
        },
      },
    }),
    vValidator("query", querySchema),
    (c) => {
      const query = c.req.valid("query");
      return c.text(`Hello ${query?.name ?? "Hono"}!`);
    }
  )
  .route("/user", user)
  .get(
    "/openapi",
    openAPISpecs(app, {
      documentation: {
        info: {
          title: "Hono API",
          version: "1.0.0",
          description: "Greeting API",
        },
        servers: [
          { url: "http://localhost:3000", description: "Local Server" },
        ],
      },
    })
  )
  .get(
    "/docs",
    apiReference({
      theme: "saturn",
      spec: { url: "/api/openapi" },
    })
  );

export const GET = handle(app);
export const POST = handle(app);
