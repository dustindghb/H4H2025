// user.ts
import { Hono } from "hono";
import { resolver, validator as vValidator } from "hono-openapi/zod";
import { describeRoute } from "hono-openapi";
import { z } from "zod";
import { sessionSelectSchema, userSelectSchema } from "../lib/db/schema";

const app = new Hono();

const responseSchema = z.object({
  user: userSelectSchema,
  session: sessionSelectSchema,
});

app.get(
  "/session",
  describeRoute({
    description: "Get the current user's session information",
    responses: {
      200: {
        description: "Returns the user's session and user data",
        content: {
          "application/json": { schema: resolver(responseSchema) },
        },
      },
      401: {
        description: "Unauthorized - User not authenticated",
        content: {
          "application/json": { schema: z.null() },
        },
      },
    },
  }),
  async (c) => {
    const session = c.get("session");
    const user = c.get("user");

    if (!user)
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );

    return c.json({
      session,
      user,
    });
  }
);

export default app;
