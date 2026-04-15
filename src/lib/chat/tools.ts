import type OpenAI from 'openai';

export const tools: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'search_menu',
      description:
        'Search the current menu for dishes matching customer preferences. ' +
        'ONLY call this after asking at least one preference question (e.g. meat or vegetarian, hearty or light). ' +
        'Do NOT call this on the first message — ask about preferences first.',
      parameters: {
        type: 'object',
        properties: {
          preferences: {
            type: 'string',
            description:
              'Customer preferences in natural language, e.g. "hearty pork dish", "vegetarian", "soup", "light meal", "something filling after work", "no pork".',
          },
        },
        required: ['preferences'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'check_delivery',
      description:
        'Check whether Hongige Beer delivers to a specific city or location. ' +
        'ALWAYS use this tool when a customer asks about delivery — never guess or answer from memory.',
      parameters: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
            description:
              'City or location name the customer provided, e.g. "Tilburg", "Eindhoven", "Amsterdam", "Rotterdam".',
          },
        },
        required: ['city'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'report_problem',
      description:
        'Use this when a customer reports a problem, complaint, or issue. ' +
        'Before calling this tool, make sure you have collected the customer\'s name and email. ' +
        'If either is missing, ask for it first — then call this tool.',
      parameters: {
        type: 'object',
        properties: {
          customer_name: {
            type: 'string',
            description: 'Full name of the customer.',
          },
          customer_email: {
            type: 'string',
            description: 'Email address of the customer.',
          },
          problem: {
            type: 'string',
            description:
              'Full description of the problem or complaint as reported by the customer.',
          },
        },
        required: ['customer_name', 'customer_email', 'problem'],
      },
    },
  },
];
