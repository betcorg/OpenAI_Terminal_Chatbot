import axios from'axios';

export const get_current_weather_tool = {
	"type": "function",
	"function": {
		"name": "get_current_weather",
		"description": "Get the current weather in a given location",
		"parameters": {
			"type": "object",
			"properties": {
				"location": {
					"type": "string",
					"description": "The city and state, e.g. San Francisco, CA",
				},
				"unit": { "type": "string", "enum": ["celsius", "fahrenheit"] },
			},
			"required": ["location"],
		},
	}
}


export const getCurrentWeather = async (args) => {

	try {
		const response = await axios.get(
			'https://api.weatherapi.com/v1/current.json',
			{
				params: {
					q: args.location,
					key: process.env.WEATHER_API_KEY,
				}
			}
		);
		const weather = response.data;

		const { condition, temp_c, temp_f } = weather.current;

		const unit = args.unit !== 'fahrenheith' ? 'celsius' : 'fahrenheith';
		const temperature = unit === 'celsius' ? temp_c : temp_f;

		return { temperature, unit, condition: condition.text };

	} catch (error) {
		console.error(error.message);
	}
}
