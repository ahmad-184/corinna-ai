import { z } from "zod";

export const CreateCampaignFormSchema = z.object({
  name: z.string().min(1),
});

export const UpdateEmailTemplateFormSchema = z.object({
  campaignId: z.string().min(1),
  emailTemplate: z.string().min(3),
});
