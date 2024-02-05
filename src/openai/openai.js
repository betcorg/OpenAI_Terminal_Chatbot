import OpenAI from 'openai';
const openaiModel = new OpenAI();

import { chunkFormatter } from '../utils/mdFormatter.js';
import { isItToolCall, getToolsData } from './getStreamToolsData.js';
import { handleToolCall } from './handleStreamToolCalls.js';
import { config, tools } from '../../config.js';
import { delay } from '../utils/delay.js';

const {
    temperature,
    max_tokens,
    stream,
    model,
    tool_choice,
} = config;

/*************************************** */


export const createChatCompletion = async (messages) => {

    const completion = await openaiModel.chat.completions.create({
        model,
        messages,
        tools,
        tool_choice,
        max_tokens,
        temperature,
        stream,
    });

    const [responseStream, toolStream] = completion.tee();

    const result = await isItToolCall(responseStream);

    if (result.tool) {

        const currentTools = await getToolsData(toolStream);
        // console.log(tools);

        await handleToolCall(currentTools, messages, openaiModel);

    } else {

        let response = '';

        for (const chunk of result.chunks) {
            const textChunk = chunk.choices[0].delta.content;
            await delay(20);
            response = await chunkFormatter(textChunk, response);
        }

        messages.push({ role: "assistant", content: response });
    }
    
}

