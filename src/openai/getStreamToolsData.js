
export const isItToolCall = async (stream) => {

    let chunks = [];

    for await (const chunk of stream) {
        if (chunk.choices[0].delta.tool_calls) {
            return { tool: true };
        } else {
            chunks.push(chunk);
        }

    }

    return { chunks: chunks };
}

export const getToolsData = async (stream) => {

    let toolCalls = [];
    for await (const chunk of stream) {
        let delta = chunk.choices[0].delta;

        if (delta.tool_calls && delta.tool_calls !== 'undefined') {
            toolCalls.push(chunk.choices[0].delta.tool_calls[0]);
        }
    }

    const toolCallsArr = toolCalls.reduce((result, toolCall) => {

        if (!result[toolCall.index]) {
            result[toolCall.index] = [];
        }

        result[toolCall.index].push(toolCall);

        return result;

    }, []);

    const toolData = toolCallsArr.map((toolCall) => {

        const name = toolCall[0].function.name;
        const id = toolCall[0].id;
        const args = toolCall.map(chunk => chunk.function.arguments).join('');

        return {
            name,
            id,
            args,
        }

    });

    return toolData;
}




