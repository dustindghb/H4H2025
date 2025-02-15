import { Hono } from "hono";
import { handle } from "hono/vercel";
import { z } from "zod";
import { describeRoute } from "hono-openapi";
// You can import these for your preferred validation library
import { resolver, validator as vValidator } from "hono-openapi/zod";
import { openAPISpecs } from "hono-openapi";
import { apiReference } from "@scalar/hono-api-reference";

export const runtime = "edge";

const app = new Hono().basePath("/api");

const querySchema = z.object({
  name: z.string(),
});

const responseSchema = z.string();

app
  .get(
    "/",
    describeRoute({
      description: "Say hello to the user",
      responses: {
        200: {
          description: "Successful response",
          content: {
            "text/plain": { schema: resolver(responseSchema) },
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
  .get("/hello", (c) => {
    return c.json({
      message: "Hello Next.js!",
    });
  })
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
