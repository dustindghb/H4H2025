import OpenAI from "openai";
import { professional } from "../db/schema";

export const createProfessionalEmbedding = async (
  openai: OpenAI,
  professionalInfo: Partial<typeof professional.$inferInsert>
) => {
  const content = `
    Professional Profile:
    Bio: ${professionalInfo.bio}
    Industry: ${professionalInfo.industry}
    Current Role: ${professionalInfo.currentRole}
    Company: ${professionalInfo.company}
    Years Experience: ${professionalInfo.yearsExperience}
    Career Journey: ${professionalInfo.careerJourney}
    Technical Skills: ${professionalInfo.technicalSkills}
    Soft Skills: ${professionalInfo.softSkills}
    Industry Trends: ${professionalInfo.industryTrends}
    Advice: ${professionalInfo.adviceForNewcomers}
  `;

  const file = await openai.files.create({
    file: new File([content], "professional_profile.txt", {
      type: "text/plain",
    }),
    purpose: "assistants",
  });

  return file.id;
};

export const initializeThread = async (
  openai: OpenAI,
  fileId: string,
  major: string
) => {
  const thread = await openai.beta.threads.create();

  const assistantId = getMajorAssistantId(major);
  if (!assistantId) {
    throw new Error("Invalid major");
  }

  const assistant = await openai.beta.assistants.update(assistantId, {
    // files: [fileId], // Removed as it does not exist in AssistantUpdateParams
  });

  return {
    threadId: thread.id,
    assistantId: assistant.id,
  };
};

const getMajorAssistantId = (major: string): string | null => {
  const assistantMap: Record<string, string> = {
    "Computer Science": "asst_vQoF1L7ULurN4cK6xv08E8fY",
    // Add more majors and their corresponding assistant IDs
  };

  return assistantMap[major] || null;
};
