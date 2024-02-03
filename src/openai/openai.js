import OpenAI from 'openai';
import config from '../../config.js';
import { chunkFormatter } from '../mdFormatter.js';

const openai = new OpenAI();

import { getCurrentWeather, get_current_weather_tool } from '../plugins/getCurrentWeather.js';
import { searchOnGoogle, search_on_google_tool } from '../plugins/googleSearch.js';
import { getWebPageSummary, get_webpage_summary_tool } from '../plugins/getWebSummary.js';
import { isItToolCall, getToolsData } from '../utils/getToolsData.js';


export const {
    temperature,
    max_tokens,
    stream,
    model,
} = config;

const tools = [
    get_current_weather_tool,
    search_on_google_tool,
    get_webpage_summary_tool,
];

const functions = {
    get_current_weather: getCurrentWeather,
    search_on_google: searchOnGoogle,
    get_webpage_summary: getWebPageSummary,
};

const delay = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const createChatCompletion = async (messages) => {

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

    const [responseStream, toolStream] = response.tee();

    const result = await isItToolCall(responseStream);

    if (result.tool) {

        const tools = await getToolsData(toolStream);
        // console.log(tools);


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

            if (name === 'get_webpage_summary') {
                let response = '';
                for (const sentence of functionResponse.sentences) {
                    await delay(30);
                    response = await chunkFormatter(sentence);
                }
                messages.push({ role: "assistant", content: response });
                return;
            }

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
            max_tokens: 1000,
            temperature: 0.5,
            stream,
        });

        let response = '';
        for await (const chunk of secondResponse) {
            const textChunk = chunk.choices[0].delta.content;
            response = await chunkFormatter(textChunk);
        }

        messages.push({ role: "assistant", content: response });

    } else {

        let response = '';

        for (const chunk of result.chunks) {
            const textChunk = chunk.choices[0].delta.content;
            await delay(20);
            response = await chunkFormatter(textChunk);
        }
        messages.push({ role: "assistant", content: response });
    }
}

