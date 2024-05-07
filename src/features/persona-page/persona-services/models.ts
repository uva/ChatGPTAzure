import { refineFromEmpty } from "@/features/common/schema-validation";
import { z } from "zod";

export const PERSONA_ATTRIBUTE = "PERSONA";
export const DEFAULT_TEMPERATURE = 1;
export const DEFAULT_TOP_P = 1;
export const DEFAULT_MODEL = process.env.DEFAULT_LLM || "gpt-4-turbo";

export type PersonaModel = z.infer<typeof PersonaModelSchema>;

// Use environment model options unless not available then hardcoded default model options
const availableModels = process.env.AVAILABLE_AZURE_OPENAI_LLMS;

const modelOptionsArray = availableModels.split(',').map((model) => model.trim()) as [string, ...string[]];

export const rawModelOptions = modelOptionsArray;

export const modelOptions = z.enum(modelOptionsArray);

export const PersonaModelSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z
    .string({
      invalid_type_error: "Invalid title",
    })
    .min(1)
    .refine(refineFromEmpty, "Title cannot be empty"),
  description: z
    .string({
      invalid_type_error: "Invalid description",
    })
    .min(1)
    .refine(refineFromEmpty, "Description cannot be empty"),
  personaMessage: z
    .string({
      invalid_type_error: "Invalid persona Message",
    })
    .min(1)
    .refine(refineFromEmpty, "System message cannot be empty"),
  isPublished: z.boolean(),
  type: z.literal(PERSONA_ATTRIBUTE),
  createdAt: z.date(),
  topP: z.number()
    .min(0, { message: "Top_P must be between 0 and 1" })
    .max(1, { message: "Top_P must be between 0 and 1" })
    .optional(),
  temperature: z.number()
    .min(0, { message: "Temperature must be between 0 and 1" })
    .max(1, { message: "Temperature must be between 0 and 1" })
    .optional(),
  model: modelOptions.optional().refine(
    (data) => data === undefined || modelOptions.options.includes(data), {
      message: "Invalid model option"
  }),
});
