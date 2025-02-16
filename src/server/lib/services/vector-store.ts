import OpenAI from "openai";

export class VectorStoreService {
  constructor(private openai: OpenAI) {}

  async createVectorStore(name: string) {
    const vectorStore = await this.openai.beta.vectorStores.create({
      name,
    });
    return vectorStore;
  }

  async addFileToStore(storeId: string, fileId: string) {
    return await this.openai.beta.vectorStores.files.create(storeId, {
      file_id: fileId,
    });
  }

  async deleteVectorStore(storeId: string) {
    return await this.openai.beta.vectorStores.del(storeId);
  }
}
