import { get_current_weather, getCurrentWeather } from './src/plugins/getCurrentWeather.js';
import { get_webpage_summary, getWebPageSummary } from './src/plugins/getWebSummary.js';
import { search_on_google, searchOnGoogle } from './src/plugins/googleSearch.js';
import { get_currency_exchange, getCurrencyExchange } from './src/plugins/getCurrencyExchange.js';


export const config = {

  /**
   * @param {String} instructions Initial instructions that will guide the model behevior
   */
  instructions: 'Eres un asistente de programación con javascript, experto en desarrollo backend con el stack MERN, e integraciones con redes neuronales desarrolladas en bibliotecas de javascript como tensorflow.js, brain.js, compromise, natural y otras bibliotecas relacionadas. También tienes conocimientos en React y tailwindcss y lo que se refiere al desarrollo de UX/UI con las texnologías mencionadas',
  /**
   * @param {String} model ID of the model to use. See the model endpoint compatibility table for
   * details on which models work with the Chat API. https://platform.openai.com/docs/modelsmodel-endpoint-compatibility 
   */

  model: 'gpt-3.5-turbo-0125',
  //model: 'gpt-4-turbo-preview',

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
  temperature: 0.5,

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


  tool_choice: 'auto',

};

export const tools = [
  get_current_weather,
  search_on_google,
  get_webpage_summary,
  get_currency_exchange,

];

export const functions = {
  get_current_weather: getCurrentWeather,
  search_on_google: searchOnGoogle,
  get_webpage_summary: getWebPageSummary,
  get_currency_exchange: getCurrencyExchange,
};

