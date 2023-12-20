
const config = {

    /**
     * @param {String} instructions Initial instructions ID Custom model instructions that will guide the
     * model behevior
     */
    instructions: 'Actúa como un experto en desarrollo de software con nodejs',

    /**
     * @param {String} model ID of the model to use. See the model endpoint compatibility table for
     * details on which models work with the Chat API. https://platform.openai.com/docs/modelsmodel-endpoint-compatibility 
     */
    model: 'gpt-3.5-turbo-1106',

    /**
     * @param {Number | null} frequency_penalty Number between -2.0 and 2.0. 
     * Positive values penalize new tokens based on their existing frequency in the text so far, 
     * decreasing the model's likelihood to repeat the same line verbatim.
     */
    frequency_penalty: null,

    /**
     * @param {Number} max_tokens, The maximum number of tokens to generate in the completion. 
     */
    max_tokens: 1000,

    /**
     * @param {Number | null} temperature What sampling temperature to use, between 0 and 2. 
     * Higher values like 0.8 will make the output more random, while lower values 
     * like 0.2 will make it more focused and deterministic. 
     * We generally recommend altering this or top_p but not both.
     */
    temperature: 1,

    /**
     * @param {Number | null} top_p An alternative to sampling with temperature, called nucleus sampling, 
     * where the model considers the results of the tokens with top_p probability mass. 
     * So 0.1 means only the tokens comprising the top 10% probability mass are considered.
     * We generally recommend altering this or temperature but not both.
     */
    top_p: null,

    /**
     * @param {Integer | null} n How many chat completion choices to generate for each input message. 
     * Note that you will be charged based on the number of generated tokens across all of the choices. 
     * Keep n as 1 to minimize costs.
     */
    n: 1,

    /**
     * @param {String | Array | null} Up to 4 sequences where the API will stop generating further tokens. 
    */
   stop: null,
   
   /**
    * @param {Boolean | null} stream If set, partial message deltas will be sent, like in ChatGPT. 
    * Tokens will be sent as data-only server-sent events as they become available, 
    * with the stream terminated by a data: [DONE] message.
    */
    stream: true,

};

export default config;