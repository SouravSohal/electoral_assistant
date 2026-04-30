import { z } from "zod";

export const UserProfileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  voterType: z.enum(["first_time", "senior", "pwd", "nri", "general"]),
  location: z.object({
    state: z.string().min(1, "State is required"),
    district: z.string().min(1, "District is required"),
  }),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  onboardingCompleted: z.boolean().default(false),
  updatedAt: z.number(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
