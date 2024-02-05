
import { functions, config } from '../../config.js';
import { chunkFormatter } from '../utils/mdFormatter.js';
// import { delay } from '../utils/delay.js';


const { model, stream } = config;

export const handleToolCall = async (tools, messages, openai) => {

    const toolMessage = [messages[messages.length - 1]];

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

    // Logs the tools that the model decided to use. 
    // console.log(toolResponse.tool_calls);

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

    // Logs the response recieved from the functions executed by each tool. 
    // console.log(toolMessage);

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
        response = await chunkFormatter(textChunk, response);
    }

    messages.push({ role: "assistant", content: response });
};
