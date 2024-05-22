"use server";
import "server-only";

import { OpenAIVisionInstance } from "@/features/common/services/openai";
import { ChatCompletionStreamingRunner } from "openai/resources/beta/chat/completions";
import { ChatThreadModel } from "../models";
import {
  DEFAULT_MODEL,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_P
} from "../../../theme/theme-config";
export const ChatApiMultimodal = (props: {
  chatThread: ChatThreadModel;
  userMessage: string;
  file: string;
  signal: AbortSignal;
}): ChatCompletionStreamingRunner => {
  const { chatThread, userMessage, signal, file } = props;

  const openAI = OpenAIVisionInstance();

  return openAI.beta.chat.completions.stream(
    {
      model: chatThread.model || DEFAULT_MODEL,
      stream: true,
      temperature: chatThread.temperature || DEFAULT_TEMPERATURE,
      top_p: chatThread.topP || DEFAULT_TOP_P,
      max_tokens: 4096,
      messages: [
        {
          role: "system",
          content:
            chatThread.personaMessage +
            "\n You are an expert in extracting insights from images that are uploaded to the chat. \n You will answer questions about the image that is provided.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: userMessage },
            {
              type: "image_url",
              image_url: {
                url: file,
              },
            },
          ],
        },
      ],
    },
    { signal }
  );
};
