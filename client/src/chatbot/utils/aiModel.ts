import { pipeline, env } from '@xenova/transformers';

// Configure Transformers.js environment
// Disable local model storage in favor of cache
env.allowLocalModels = false;

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type ModelStatus = 'idle' | 'loading' | 'ready' | 'error';

// Singleton pattern for model instance
let modelInstance: any = null;
let modelStatus: ModelStatus = 'idle';
let modelError: string | null = null;

/**
 * Initialize the text generation model
 * Using Qwen2.5-0.5B-Instruct - small, fast, and good quality
 */
export const initializeModel = async (
  onProgress?: (progress: any) => void
): Promise<void> => {
  if (modelInstance) return;
  if (modelStatus === 'loading') return;

  try {
    modelStatus = 'loading';
    modelError = null;

    // Use text-generation pipeline with Qwen model
    modelInstance = await pipeline(
      'text-generation',
      'Xenova/Qwen2.5-0.5B-Instruct',
      {
        progress_callback: onProgress,
      }
    );

    modelStatus = 'ready';
  } catch (error) {
    modelStatus = 'error';
    modelError =
      error instanceof Error ? error.message : 'Failed to load model';
    throw error;
  }
};

/**
 * Generate a response using the model with context
 */
export const generateResponse = async (
  messages: ChatMessage[],
  context: string
): Promise<string> => {
  if (!modelInstance) {
    throw new Error('Model not initialized. Call initializeModel() first.');
  }

  try {
    // Build prompt with context
    const systemPrompt = `You are a helpful AI assistant for a professional resume/portfolio website.
Your job is to answer questions about the person's experience, skills, projects, and background.
Be concise, professional, and friendly. If you don't know something, say so.

Here is the relevant information about the person:
${context}`;

    // Format conversation for the model
    const conversationHistory = messages
      .map((msg) => {
        if (msg.role === 'user') return `User: ${msg.content}`;
        if (msg.role === 'assistant') return `Assistant: ${msg.content}`;
        return '';
      })
      .filter(Boolean)
      .join('\n');

    const fullPrompt = `${systemPrompt}

${conversationHistory}
Assistant:`;

    // Generate response
    const result = await modelInstance(fullPrompt, {
      max_new_tokens: 150,
      temperature: 0.7,
      top_p: 0.9,
      repetition_penalty: 1.2,
      do_sample: true,
    });

    // Extract generated text
    let generatedText = result[0].generated_text;

    // Remove the prompt from the response
    generatedText = generatedText.replace(fullPrompt, '').trim();

    // Clean up the response
    // Remove any "User:" or "Assistant:" prefixes that might have been generated
    generatedText = generatedText.split(/\n(User:|Assistant:)/)[0].trim();

    return (
      generatedText ||
      'I apologize, but I could not generate a response. Please try rephrasing your question.'
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Get current model status
 */
export const getModelStatus = (): ModelStatus => {
  return modelStatus;
};

/**
 * Get current model error if any
 */
export const getModelError = (): string | null => {
  return modelError;
};

/**
 * Check if model is ready
 */
export const isModelReady = (): boolean => {
  return modelStatus === 'ready' && modelInstance !== null;
};
