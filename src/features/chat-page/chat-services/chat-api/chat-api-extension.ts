/* Execution of the LLM model using the default and any additional extensions
*/

"use server";
import "server-only";

import { OpenAIInstance } from "@/features/common/services/openai";
import { FindExtensionByID } from "@/features/extensions-page/extension-services/extension-service";
import { RunnableToolFunction } from "openai/lib/RunnableFunction";
import { ChatCompletionStreamingRunner } from "openai/resources/beta/chat/completions";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { ChatThreadModel } from "../models";
import {
  DEFAULT_MODEL,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_P
} from "../../../theme/theme-config";
export const ChatApiExtensions = async (props: {
  chatThread: ChatThreadModel;
  userMessage: string;
  history: ChatCompletionMessageParam[];
  extensions: RunnableToolFunction<any>[];
  signal: AbortSignal;
}): Promise<ChatCompletionStreamingRunner> => {
  const { userMessage, history, signal, chatThread, extensions } = props;

  const openAI = OpenAIInstance();
  const systemMessage = await extensionsSystemMessage(chatThread);
  return openAI.beta.chat.completions.runTools(
    {
      model: chatThread.model || DEFAULT_MODEL,
      stream: true,
      temperature: chatThread.temperature || DEFAULT_TEMPERATURE,
      top_p: chatThread.topP || DEFAULT_TOP_P,
      messages: [
        {
          role: "system",
          content: chatThread.personaMessage + "\n" + systemMessage,
        },
        ...history,
        {
          role: "user",
          content: userMessage,
        },
      ],
      tools: extensions,
    },
    { signal: signal }
  );
};

const extensionsSystemMessage = async (chatThread: ChatThreadModel) => {
  let message = "";

  for (const e of chatThread.extension) {
    const extension = await FindExtensionByID(e);
    if (extension.status === "OK") {
      message += ` ${extension.response.executionSteps} \n`;
    }
  }

  return message;
};
