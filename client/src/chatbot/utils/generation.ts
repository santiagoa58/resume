import { TextGenerationPipeline } from '@xenova/transformers';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface GenerationParams {
  max_new_tokens: number;
  temperature: number;
  top_k: number;
  repetition_penalty: number;
  do_sample: boolean;
}

// Improved generation parameters for factual Q&A
const DEFAULT_PARAMS: GenerationParams = {
  max_new_tokens: 256, // Increased from 150
  temperature: 0.3, // Lowered from 0.7 for more factual responses
  top_k: 40, // Added for better control
  repetition_penalty: 1.1, // Lowered from 1.2 for more natural output
  do_sample: true,
};

/**
 * Sanitize user input to prevent prompt injection
 */
const sanitizeInput = (input: string): string => {
  // Remove potential injection attempts
  const sanitized = input
    // Remove multiple newlines that could break prompt structure
    .replace(/\n{3,}/g, '\n\n')
    // Remove suspicious instruction-like patterns
    .replace(/(?:ignore|disregard|forget)\s+(?:previous|all|above)/gi, '')
    // Limit length
    .slice(0, 500);

  return sanitized.trim();
};

/**
 * Build improved prompt with better structure
 */
const buildPrompt = (
  messages: ChatMessage[],
  context: string,
  resumeHolderName?: string
): string => {
  // Sanitize context
  const sanitizedContext = context.slice(0, 8000); // Limit context size

  // Build system prompt with better instructions
  const systemPrompt = `You are an AI assistant representing ${
    resumeHolderName || 'a professional'
  }.

Your role:
1. Answer questions about ${
    resumeHolderName || 'this person'
  }'s experience, skills, and projects using ONLY the provided information
2. Be concise, professional, and friendly
3. If information is not in the provided context, say "I don't have that information in the current resume"
4. Keep responses under 150 words
5. Be specific and cite relevant experience or projects when applicable

Information:
${sanitizedContext}

---`;

  // Format conversation with proper separation
  const conversationHistory = messages
    .map((msg) => {
      const sanitizedContent = sanitizeInput(msg.content);
      if (msg.role === 'user') return `User: ${sanitizedContent}`;
      if (msg.role === 'assistant') return `Assistant: ${sanitizedContent}`;
      return '';
    })
    .filter(Boolean)
    .join('\n');

  return `${systemPrompt}\n\n${conversationHistory}\nAssistant:`;
};

/**
 * Post-process generated text
 */
const postProcessResponse = (generatedText: string, prompt: string): string => {
  // Remove the prompt if it appears
  let response = generatedText.replace(prompt, '').trim();

  // Find the actual response (everything before next "User:" or "Assistant:")
  const match = response.match(/^(.*?)(?:\n(?:User:|Assistant:))/s);
  if (match) {
    response = match[1].trim();
  }

  // Clean up artifacts
  response = response
    .replace(/^Assistant:\s*/i, '')
    .replace(/^AI:\s*/i, '')
    .trim();

  // Validate response quality
  if (!response || response.length < 10) {
    return 'I apologize, but I could not generate a proper response. Could you rephrase your question?';
  }

  return response;
};

/**
 * Generate AI response with improved parameters and security
 */
export const generateResponse = async (
  model: TextGenerationPipeline,
  messages: ChatMessage[],
  context: string,
  resumeHolderName?: string
): Promise<string> => {
  if (!model) {
    throw new Error('Model not initialized');
  }

  // Build prompt with sanitization
  const prompt = buildPrompt(messages, context, resumeHolderName);

  // Validate prompt length (rough token estimate: ~4 chars per token)
  const estimatedTokens = prompt.length / 4 + DEFAULT_PARAMS.max_new_tokens;
  if (estimatedTokens > 32000) {
    // Qwen2.5 context limit
    throw new Error(
      'Prompt too long. Please start a new conversation or ask a shorter question.'
    );
  }

  try {
    const result = await model(prompt, DEFAULT_PARAMS);

    // Type assertion for the result structure
    const output = result as Array<{ generated_text: string }>;

    if (!output?.[0]?.generated_text) {
      throw new Error('Invalid model response');
    }

    const generatedText = output[0].generated_text;
    return postProcessResponse(generatedText, prompt);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to generate response');
  }
};

/**
 * Generate unique message ID
 */
export const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
