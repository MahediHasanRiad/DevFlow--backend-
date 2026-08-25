import { z } from "zod";


export const TeamMemberSchema = z.object({
  id: z.string().uuid("Invalid team member ID"),
  teamId: z.string().uuid("Invalid team ID"),
  userId: z.string().uuid("Invalid user ID"),
  responsibility: z.enum(['UI_UX', 'FRONTEND', 'BACKEND', 'FULL_STACK', 'QA', 'DEVOPS', 'TEAM_LEAD']),
  joinedAt: z.date(),
});

export type TeamMemberType = z.infer<typeof TeamMemberSchema>;

// ------------------------------------------------

export const CreateTeamMemberInputSchema = z.object({
  teamId: z.string().uuid("Invalid team ID"),
  userId: z.string().uuid("Invalid user ID"),
  responsibility: z.enum(['UI_UX', 'FRONTEND', 'BACKEND', 'FULL_STACK', 'QA', 'DEVOPS', 'TEAM_LEAD']),
});

export type CreateTeamMemberType = z.infer<typeof CreateTeamMemberInputSchema>;

// ------------------------------------------------

export const UpdateTeamMemberInputSchema = z.object({
  teamId: z.string().uuid("Invalid team ID"),
  responsibility: z.enum(['UI_UX', 'FRONTEND', 'BACKEND', 'FULL_STACK', 'QA', 'DEVOPS', 'TEAM_LEAD']),
});

export type UpdateTeamMemberType = z.infer<typeof UpdateTeamMemberInputSchema>;
