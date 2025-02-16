// user.ts
import { Hono } from "hono";
import { resolver, validator as zValidator } from "hono-openapi/zod";
import { describeRoute } from "hono-openapi";
import { z } from "zod";
import {
  professionalinsertSchema,
  professionalSelectSchema,
  sessionSelectSchema,
  userPreferencesSelectSchema,
  userSelectSchema,
} from "../lib/db/schema";
import { db } from "../lib/db/db";
// import { zValidator } from "@hono/zod-validator";
import {
  user as _user,
  student as _student,
  professional as _professional,
} from "../lib/db/schema";
import { eq } from "drizzle-orm";

const app = new Hono();

const responseSchema = z.object({
  user: userSelectSchema,
  session: sessionSelectSchema,
});

app
  .patch(
    "/type",
    describeRoute({
      description: "Update user type (student/professional)",
      responses: {
        200: {
          description: "Successfully updated user type",
          content: {
            "application/json": {
              schema: resolver(
                z.object({
                  user: userSelectSchema,
                })
              ),
            },
          },
        },
        401: {
          description: "Unauthorized - User not authenticated",
          content: {
            "application/json": {
              schema: resolver(
                z.object({
                  error: z.string(),
                })
              ),
            },
          },
        },
        400: {
          description: "Bad Request - Invalid type provided",
          content: {
            "application/json": {
              schema: resolver(
                z.object({
                  error: z.string(),
                })
              ),
            },
          },
        },
      },
    }),
    zValidator(
      "json",
      z.object({
        type: z.enum(["student", "professional"], {
          required_error: "Type is required",
          invalid_type_error: "Type must be either 'student' or 'professional'",
        }),
      })
    ),
    zValidator(
      "json",
      z.object({
        type: z.enum(["student", "professional"], {
          required_error: "Type is required",
          invalid_type_error: "Type must be either 'student' or 'professional'",
        }),
      })
    ),
    async (c) => {
      const user = c.get("user");
      const { type } = c.req.valid("json");

      if (!user) {
        return c.json(
          {
            error: "Unauthorized - User not authenticated",
          },
          401
        );
      }

      try {
        const updatedUser = await db
          .update(_user)
          .set({ type, updatedAt: new Date() })
          .where(eq(_user.id, user.id))
          .returning();

        return c.json({
          user: updatedUser[0],
        });
      } catch (error) {
        return c.json(
          {
            error: "Failed to update user type",
          },
          500
        );
      }
    }
  )
  .get(
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
            "application/json": {
              schema: resolver(z.object({ error: z.string() })),
            },
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
  )
  .post(
    "/student-preferences",
    describeRoute({
      description: "Insert student preferences",
      responses: {
        200: {
          description: "Successfully inserted student preferences",
          content: {
            "application/json": {
              schema: resolver(
                z.object({
                  student: userPreferencesSelectSchema,
                })
              ),
            },
          },
        },
        401: {
          description: "Unauthorized - User not authenticated",
          content: {
            "application/json": {
              schema: resolver(
                z.object({
                  error: z.string(),
                })
              ),
            },
          },
        },
        400: {
          description: "Bad Request - Invalid json structure provided",
          content: {
            "application/json": {
              schema: resolver(
                z.object({
                  error: z.string(),
                })
              ),
            },
          },
        },
      },
    }),
    zValidator(
      "json",
      z.object({
        skills: z.array(z.string()),
        workEnvironments: z.array(z.string()),
        coreValues: z.string(),
        industryInterests: z.array(z.string()),
        learningStyles: z.array(z.string()),
      })
    ),
    async (c) => {
      const user = c.get("user");
      const preferences = c.req.valid("json");

      if (!user) {
        return c.json(
          {
            error: "Unauthorized - User not authenticated",
          },
          401
        );
      }

      try {
        const updatedStudent = await db
          .insert(_student)
          .values({
            ...preferences,
            userId: user.id,
          })
          .returning();

        return c.json({
          student: updatedStudent[0],
        });
      } catch (error) {
        return c.json(
          {
            error: "Failed to update student preferences",
          },
          500
        );
      }
    }
  )
  .post(
    "/professional-profile",
    describeRoute({
      description: "Create mentor profile with professional experience",
      responses: {
        200: {
          description: "Successfully created mentor profile",
          content: {
            "application/json": {
              schema: resolver(
                z.object({
                  mentor: professionalSelectSchema,
                })
              ),
            },
          },
        },
        401: {
          description: "Unauthorized - User not authenticated",
          content: {
            "application/json": {
              schema: resolver(
                z.object({
                  error: z.string(),
                })
              ),
            },
          },
        },
        400: {
          description: "Bad Request - Invalid json structure provided",
          content: {
            "application/json": {
              schema: resolver(
                z.object({
                  error: z.string(),
                })
              ),
            },
          },
        },
      },
    }),
    zValidator("json", professionalinsertSchema),
    async (c) => {
      const user = c.get("user");
      const professionalInfo = c.req.valid("json");

      if (!user) {
        return c.json(
          {
            error: "Unauthorized - User not authenticated",
          },
          401
        );
      }

      try {
        const newMentorProfile = await db
          .insert(_professional)
          .values({
            ...professionalInfo,
            userId: user.id,
          })
          .returning();

        return c.json({
          mentor: newMentorProfile[0],
        });
      } catch (error) {
        return c.json(
          {
            error: "Failed to create mentor profile",
          },
          500
        );
      }
    }
  );

export default app;
