// app/api/chat-health/route.ts
import OpenAI from 'openai';
 
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const HEALTH_ASSISTANT_ID = process.env.OPENAI_HEALTH_ASSISTANT_ID;

export async function POST(req: Request) {
  try {
    // Debug logging
    console.log('Health Assistant ID:', HEALTH_ASSISTANT_ID);
    
    if (!HEALTH_ASSISTANT_ID) {
      throw new Error('Health Assistant ID not configured');
    }

    const { message, threadId } = await req.json();
    console.log('Received message:', message);
    
    // Create a new thread if threadId is not provided
    const thread = threadId 
      ? await openai.beta.threads.retrieve(threadId)
      : await openai.beta.threads.create();

    console.log('Thread ID:', thread.id);

    // Add the user's message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: HEALTH_ASSISTANT_ID,
    });

    console.log('Run started with ID:', run.id);

    // Poll for the completion of the run
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    
    while (runStatus.status === "queued" || runStatus.status === "in_progress") {
      console.log('Run status:', runStatus.status);
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // Get the messages from the thread
    const messages = await openai.beta.threads.messages.list(thread.id);
    
    // Get the last assistant message
    const lastMessage = messages.data
      .filter(message => message.role === "assistant")
      .pop();

    // Extract the text content from the message
    let messageContent = "";
    if (lastMessage && lastMessage.content.length > 0) {
      const textContent = lastMessage.content.find(
        content => content.type === 'text'
      );
      if (textContent && 'text' in textContent) {
        messageContent = textContent.text.value;
      }
    }

    console.log('Response content:', messageContent);

    return Response.json({
      message: messageContent || "No response",
      threadId: thread.id
    });
  } catch (error) {
    console.error('Error in health chat:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Error processing request' 
    }, { status: 500 });
  }
}