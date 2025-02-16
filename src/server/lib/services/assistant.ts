import OpenAI from "openai";
import { VectorStoreService } from "./vector-store";

const MAJOR_ASSISTANT_MAP: Record<
  string,
  { assistantId: string; vectorStoreId: string }
> = {
  "Computer Science": {
    assistantId: "asst_Vg6DL8zuPNTddfFIQRI8n7PQ",
    vectorStoreId: "vs_67b131c633488191b66762fb1f3e2b84",
  },
  Business: {
    assistantId: "asst_v9djFHXFqZ2l3z8Ea5o1Dh46",
    vectorStoreId: "vs_67b1408545488191ab6a553e8d0a4865",
  },
  Healthcare: {
    assistantId: "asst_0Y35YmSyWLY9xryRoMSPFGNy",
    vectorStoreId: "asst_0Y35YmSyWLY9xryRoMSPFGNy",
  },
};

export class AssistantService {
  constructor(
    private openai: OpenAI,
    private vectorStore: VectorStoreService
  ) {}

  async getAssistantForMajor(major: string) {
    const config = MAJOR_ASSISTANT_MAP[major];
    if (!config) {
      throw new Error(`No assistant configured for major: ${major}`);
    }
    return config;
  }

  async attachFileToAssistant(params: {
    assistantId: string;
    vectorStoreId: string;
    fileId: string;
  }) {
    // Add file to vector store
    await this.vectorStore.addFileToStore(params.vectorStoreId, params.fileId);
  }

  async createThread() {
    return await this.openai.beta.threads.create();
  }

  async createMessage(threadId: string, content: string) {
    return await this.openai.beta.threads.messages.create(threadId, {
      role: "user",
      content,
    });
  }

  async createRun(threadId: string, assistantId: string) {
    return await this.openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });
  }

  async getRunStatus(threadId: string, runId: string) {
    return await this.openai.beta.threads.runs.retrieve(threadId, runId);
  }

  async createThreadForUser(userId: string) {
    const thread = await this.openai.beta.threads.create({
      metadata: {
        userId, // Track which user this thread belongs to
      },
    });
    return thread;
  }

  async getUserThread(userId: string, assistantId: string) {
    // Look up existing thread or create new one
    // Note: OpenAI doesn't provide thread search, so you'll need to store this mapping in your database
    const thread = await this.createThreadForUser(userId);
    return thread;
  }

  async createMessageInThread(params: {
    userId: string;
    threadId: string;
    content: string;
    assistantId: string;
  }) {
    const message = await this.createMessage(params.threadId, params.content);
    const run = await this.createRun(params.threadId, params.assistantId);
    return { message, run };
  }
}
