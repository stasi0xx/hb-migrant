import OpenAI from 'openai';
import { buildSystemPrompt } from '@/lib/chat/system-prompt';
import { tools } from '@/lib/chat/tools';
import { handleToolCall } from '@/lib/chat/tool-handlers';
import type { ChatMessage } from '@/lib/chat/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = 'gpt-4o-mini';
const MAX_TOKENS = 1024;
const MAX_TOOL_ROUNDS = 5;

export async function POST(req: Request) {
  const { messages, locale } = (await req.json()) as {
    messages: ChatMessage[];
    locale: string;
  };

  const systemPrompt = buildSystemPrompt(locale ?? 'pl');
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      const send = (text: string) => controller.enqueue(encoder.encode(text));

      try {
        const currentMessages: OpenAI.Chat.ChatCompletionMessageParam[] = messages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));

        let rounds = 0;

        while (rounds < MAX_TOOL_ROUNDS) {
          rounds++;

          const response = await openai.chat.completions.create({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            messages: [{ role: 'system', content: systemPrompt }, ...currentMessages],
            tools,
            tool_choice: 'auto',
          });

          const choice = response.choices[0];
          const message = choice.message;

          // No tool calls → final text response
          if (!message.tool_calls || message.tool_calls.length === 0) {
            send(message.content ?? '');
            break;
          }

          // Execute each tool call
          // Push assistant message first (required by OpenAI for multi-turn tool use)
          currentMessages.push({
            role: 'assistant',
            content: message.content ?? null,
            tool_calls: message.tool_calls,
          });

          for (const toolCall of message.tool_calls) {
            let result: string;
            try {
              const input = JSON.parse(toolCall.function.arguments) as Record<string, string>;
              result = handleToolCall(toolCall.function.name, input);
            } catch (toolErr) {
              console.error('[/api/chat] tool execution error:', toolErr);
              result = 'Błąd podczas wykonania narzędzia.';
            }

            currentMessages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: result,
            });
          }
        }

        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[/api/chat] error:', message);

        const fallback =
          locale === 'en'
            ? 'Sorry, something went wrong. Please try again.'
            : 'Przepraszam, coś poszło nie tak. Spróbuj ponownie.';
        send(fallback);
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}
