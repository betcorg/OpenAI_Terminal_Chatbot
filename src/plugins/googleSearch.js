import axios from'axios';

export const search_on_google_tool = {
	"type": "function",
	"function": {
		"name": "search_on_google",
		"description": "Search on Google for the given query",
		"parameters": {
			"type": "object",
			"properties": {
				"query": {
					"type": "string",
					"description": "The query introduced by the user",
				},

			},
			"required": ["query"],
		},
	}
};

export const searchOnGoogle = async (args) => {

    try {
		const response = await axios.get(
			'https://www.googleapis.com/customsearch/v1',
			{
				params: {
					key: process.env.GOOGLE_SEARCH_API_KEY,
					cx : process.env.GOOGLE_SEARCH_CX,
					q: args.query,
				}
			}
		);

	let items = [];

	for (const item of response.data.items) {
		items.push({
			title: item.title,
			url: item.formattedUrl,
		});
	}
	// console.log(items);
	return items;

	} catch (error) {
		console.error(error.message);
	}

};

