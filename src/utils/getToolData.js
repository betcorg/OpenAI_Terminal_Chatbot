import fs from 'fs';

export const isItToolCall = async (stream) => {
    for await (const chunk of stream) {
        if (chunk.choices[0].delta.tool_calls) {
            return true;
        }
    }
    return false;
}

export const getToolData = async (stream) => {

    let toolCalls = [];
    for await (const chunk of stream) {

        let delta = chunk.choices[0].delta;

        if (delta.tool_calls && delta.tool_calls !== 'undefined') {
            toolCalls.push(chunk.choices[0].delta.tool_calls[0]);

        }
    }
    fs.writeFileSync('./toolCalls.json', JSON.stringify(toolCalls));

    const toolCallsArr = toolCalls.reduce((result, toolCall) => {

        if (!result[toolCall.index]) {
            result[toolCall.index] = [];
        }
        result[toolCall.index].push(toolCall);
        return result;
    }, []);

    fs.writeFileSync('./toolCallsArr.json', JSON.stringify(toolCallsArr));


    const toolData = toolCallsArr.map((toolCall) => {
        let name = toolCall[0].function.name;

        let id = toolCall[0].id;

        let args = toolCall.map(chunk => chunk.function.arguments).join('');
        return {
            name,
            id,
            args,
        }
    });

    return toolData;
}




