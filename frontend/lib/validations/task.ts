import { z } from "zod"

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(1000).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  assigneeId: z.string().optional(),
})

export const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(1000).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  assigneeId: z.string().optional(),
})
