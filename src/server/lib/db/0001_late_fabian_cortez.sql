CREATE TABLE "student" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"skills" text[] NOT NULL,
	"work_environments" text[] NOT NULL,
	"core_values" text NOT NULL,
	"industry_interests" text[] NOT NULL,
	"learning_styles" text[] NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;