// user.ts
import { Hono } from "hono";
import { resolver, validator as zValidator } from "hono-openapi/zod";
import { describeRoute } from "hono-openapi";
import { z } from "zod";
import {
  professionalinsertSchema,
  professionalSelectSchema,
  sessionSelectSchema,
  userPreferencesinsertSchema,
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
import { and, desc, eq } from "drizzle-orm";

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
        intrestedMajors: z.array(z.string()),
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
  )
  .get(
    "/student/:id",
    describeRoute({
      description: "Get student profile by ID",
      responses: {
        200: {
          description: "Successfully retrieved student profile",
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
              schema: resolver(z.object({ error: z.string() })),
            },
          },
        },
        404: {
          description: "Student not found",
          content: {
            "application/json": {
              schema: resolver(z.object({ error: z.string() })),
            },
          },
        },
      },
    }),
    async (c) => {
      const user = c.get("user");
      if (!user) {
        return c.json(
          {
            error: "Unauthorized - User not authenticated",
          },
          401
        );
      }
      const { id } = c.req.param();
      const [student] = await db
        .select()
        .from(_student)
        .where(and(eq(_student.userId, user.id), eq(_student.id, id)));

      if (!student) {
        return c.json({ error: "Student not found" }, 404);
      }

      return c.json({ student });
    }
  )
  .get(
    "/professional/:id",
    describeRoute({
      description: "Get professional profile by ID",
      responses: {
        200: {
          description: "Successfully retrieved professional profile",
          content: {
            "application/json": {
              schema: resolver(
                z.object({
                  professional: professionalSelectSchema,
                })
              ),
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: resolver(z.object({ error: z.string() })),
            },
          },
        },
        404: {
          description: "Professional not found",
          content: {
            "application/json": {
              schema: resolver(z.object({ error: z.string() })),
            },
          },
        },
      },
    }),
    async (c) => {
      const user = c.get("user");
      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const { id } = c.req.param();
      const professional = await db
        .select()
        .from(_professional)
        .where(
          and(eq(_professional.userId, user.id), eq(_professional.id, id))
        );

      if (!professional) {
        return c.json({ error: "Professional not found" }, 404);
      }

      return c.json({ professional });
    }
  )
  .patch(
    "/student-preferences/:id",
    describeRoute({
      description: "Update student preferences",
      responses: {
        200: {
          description: "Successfully updated student preferences",
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
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: resolver(z.object({ error: z.string() })),
            },
          },
        },
      },
    }),
    zValidator(
      "json",
      userPreferencesinsertSchema.partial().omit({
        id: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      })
    ),
    async (c) => {
      const user = c.get("user");
      const { id } = c.req.param();
      const updates = c.req.valid("json");

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const updatedStudent = await db
          .update(_student)
          .set({ ...updates, updatedAt: new Date() })
          .where(and(eq(_student.userId, user.id), eq(_student.id, id)))
          .returning();

        return c.json({ student: updatedStudent[0] });
      } catch (error) {
        return c.json({ error: "Failed to update student preferences" }, 500);
      }
    }
  )
  .patch(
    "/professional-profile/:id",
    describeRoute({
      description: "Update professional profile",
      responses: {
        200: {
          description: "Successfully updated professional profile",
          content: {
            "application/json": {
              schema: resolver(
                z.object({
                  professional: professionalSelectSchema,
                })
              ),
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: resolver(z.object({ error: z.string() })),
            },
          },
        },
      },
    }),
    zValidator("json", professionalinsertSchema.partial()),
    async (c) => {
      const user = c.get("user");
      const { id } = c.req.param();
      const updates = c.req.valid("json");

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const updatedProfessional = await db
          .update(_professional)
          .set({ ...updates, updatedAt: new Date() })
          .where(
            and(eq(_professional.userId, user.id), eq(_professional.id, id))
          )
          .returning();

        return c.json({ professional: updatedProfessional[0] });
      } catch (error) {
        return c.json({ error: "Failed to update professional profile" }, 500);
      }
    }
  )
  .delete(
    "/student/:id",
    describeRoute({
      description: "Delete student profile",
      responses: {
        200: {
          description: "Successfully deleted student profile",
          content: {
            "application/json": {
              schema: resolver(z.object({ success: z.boolean() })),
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: resolver(z.object({ error: z.string() })),
            },
          },
        },
      },
    }),
    async (c) => {
      const user = c.get("user");
      const { id } = c.req.param();

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const [student] = await db
          .delete(_student)
          .where(and(eq(_student.userId, user.id), eq(_student.id, id)))
          .returning();
        if (!student) {
          return c.json({ error: "Student not found" }, 404);
        }
        return c.json({ success: true });
      } catch (error) {
        return c.json({ error: "Failed to delete student profile" }, 500);
      }
    }
  )
  .delete(
    "/professional/:id",
    describeRoute({
      description: "Delete professional profile",
      responses: {
        200: {
          description: "Successfully deleted professional profile",
          content: {
            "application/json": {
              schema: resolver(z.object({ success: z.boolean() })),
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: resolver(z.object({ error: z.string() })),
            },
          },
        },
      },
    }),
    async (c) => {
      const user = c.get("user");
      const { id } = c.req.param();

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const [professional] = await db
          .delete(_professional)
          .where(
            and(eq(_professional.userId, user.id), eq(_professional.id, id))
          )
          .returning();

        if (!professional) {
          return c.json({ error: "Professional not found" }, 404);
        }
        return c.json({ success: true });
      } catch (error) {
        return c.json({ error: "Failed to delete professional profile" }, 500);
      }
    }
  )
  .get(
    "/professionals",
    describeRoute({
      description: "Get all professional profiles",
      responses: {
        200: {
          description: "Successfully retrieved all professional profiles",
          content: {
            "application/json": {
              schema: resolver(
                z.object({
                  professionals: z.array(professionalSelectSchema),
                })
              ),
            },
          },
        },
      },
    }),
    async (c) => {
      try {
        const user = c.get("user");
        if (!user) {
          return c.json({ error: "Unauthorized" }, 401);
        }
        const professionals = await db
          .select()
          .from(_professional)
          .orderBy(desc(_professional.createdAt));

        return c.json({ professionals });
      } catch (error) {
        return c.json({ error: "Failed to fetch professionals" }, 500);
      }
    }
  );

export default app;
