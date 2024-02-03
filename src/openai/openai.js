import 'dotenv/config';
import OpenAI from 'openai';
import config from '../../config.js';

const openai = new OpenAI();

import { getCurrentWeather, get_current_weather_tool } from '../plugins/getCurrentWeather.js';
import { searchOnGoogle, search_on_google_tool } from '../plugins/googleSearch.js';
import { isItToolCall, getToolData } from '../utils/getToolData.js';


export let {
    temperature,
    max_tokens,
    stream,
    model,
} = config;

const tools = [
    search_on_google_tool,
    get_current_weather_tool,
];

const functions = {
    get_current_weather: getCurrentWeather,
    search_on_google: searchOnGoogle,
};

export const createChatCompletion = async (messages) => {
    const originalMessages = messages;
    const toolMessage = [...messages]
    toolMessage.shift();

    const response = await openai.chat.completions.create({
        model,
        messages,
        tools: tools,
        tool_choice: 'auto',
        max_tokens,
        temperature,
        stream,
    });

    const [streamRes, toolStream] = response.tee();

    const isToolCall = await isItToolCall(streamRes);

    if (isToolCall) {

        const tools = await getToolData(toolStream);

        const toolResponse = {
            "role": "assistant",
            "content": null,
            "tool_calls": [],
        }

        tools.forEach((tool) => {
            const { id, name, args } = tool;

            toolResponse.tool_calls.push({
                "id": id,
                "type": "function",
                "function": {
                    "name": name,
                    "arguments": args,
                }
            });
        });
        toolMessage.push(toolResponse);

        for (const tool of tools) {

            const { id, name, args } = tool;

            const currentFunction = functions[name];
            const functionResponse = await currentFunction(JSON.parse(args));

            toolMessage.push({
                tool_call_id: id,
                role: 'tool',
                name: name,
                content: JSON.stringify(functionResponse),
            });
        }

        const secondResponse = await openai.chat.completions.create({
            model,
            messages: toolMessage,
            max_tokens: 200,
            temperature: 0.5,
            stream,
        });

        return secondResponse;

    } else {
        return  await openai.chat.completions.create({
            model,
            messages: originalMessages,
            max_tokens,
            temperature,
            stream,
        });
    }
}

