export const AI_NAME = "UvA AI Chat";
export const AI_DESCRIPTION = "Je neemt deel aan experimentele inzet van ChatGPT binnen de UvA. Let er op dat je geen persoonsgegevens deelt. In het experiment wordt gekeken naar gebruik, verbruik en  monitoring en alerting opties. Deze dienst is nog niet productie klaar en kan haperingen vertonen. Reken er dus niet op dat je chatgeschiedenis bewaard blijft!";
export const CHAT_DEFAULT_PERSONA = AI_NAME + " default";

// default settings for persona's:
export const CHAT_DEFAULT_SYSTEM_PROMPT = `You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture. You must always return in markdown format.

You have access to the following functions:
1. create_img: You must only use the function create_img if the user asks you to create an image.`;

export const DEFAULT_MODEL = process.env.DEFAULT_LLM || 'gpt-4-turbo'
export const DEFAULT_TEMPERATURE = 1
export const DEFAULT_TOP_P = 1

export const NEW_CHAT_NAME = "New chat";
