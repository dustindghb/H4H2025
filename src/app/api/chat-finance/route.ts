import OpenAI from 'openai';
 
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const FINANCE_ASSISTANT_ID = process.env.OPENAI_FINANCE_ASSISTANT_ID;

export async function POST(req: Request) {
  try {
    const { message, threadId } = await req.json();
    
    const thread = threadId 
      ? await openai.beta.threads.retrieve(threadId)
      : await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: FINANCE_ASSISTANT_ID!,
    });

    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    
    while (runStatus.status === "queued" || runStatus.status === "in_progress") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    const messages = await openai.beta.threads.messages.list(thread.id);
    
    const lastMessage = messages.data
      .filter(message => message.role === "assistant")
      .pop();

    let messageContent = "";
    if (lastMessage && lastMessage.content.length > 0) {
      const textContent = lastMessage.content.find(
        content => content.type === 'text'
      );
      if (textContent && 'text' in textContent) {
        messageContent = textContent.text.value;
      }
    }

    return Response.json({
      message: messageContent || "No response",
      threadId: thread.id
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Error processing request' }, { status: 500 });
  }
}