import { z } from "zod";

// 1. Enum Definition
// Replace/add values based on your Prisma Designation enum
export const DesignationEnum = z.enum([
  "TEAM_LEAD",
  "FRONTEND",
  "BACKEND",
  "FULL_STACK",
  "QA",
  "DEVOPS",
]);

// 2. Base Schema (matches the full model)
export const projectMemberSchema = z.object({
  id: z.string().uuid({ message: "Invalid ProjectMember ID" }),
  projectId: z.string().uuid({ message: "Invalid Project ID" }),
  userId: z.string().uuid({ message: "Invalid User ID" }),
  responsibility: DesignationEnum,
  joinedAt: z.coerce.date().default(() => new Date()),
});

// 3. Create ProjectMember Schema
export const createProjectMemberSchema = z.object({
  projectId: z
    .string()
    .uuid({ message: "Project ID is required and must be a valid UUID" }),
  userId: z
    .string()
    .uuid({ message: "User ID is required and must be a valid UUID" }),
  responsibility: DesignationEnum,
});

// 4. Update ProjectMember Schema
// In an update, typically only the role/responsibility is modified
export const updateProjectMemberSchema = z.object({
  responsibility: DesignationEnum.optional(),
});

// 5. TypeScript Inferred Types
export type ProjectMemberType = z.infer<typeof projectMemberSchema>;
export type CreateProjectMemberInputType = z.infer<
  typeof createProjectMemberSchema
>;
export type UpdateProjectMemberInputType = z.infer<
  typeof updateProjectMemberSchema
>;
