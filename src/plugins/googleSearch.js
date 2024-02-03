import axios from 'axios';

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
				"file_type": {
					"type": "string",
					"description": "The format or extension of the document to look for",
				},
				"search_results": {
					"type": "number",
					"description": "The number of results to return. The maximum is 10."

				},
			},
			"required": ["query"],
		},
	}
};

export const searchOnGoogle = async (args) => {

	console.log(args);
	const params = {
		key: process.env.GOOGLE_SEARCH_API_KEY,
		cx: process.env.GOOGLE_SEARCH_CX,
		q: args.query,
		num: 5,
	}

	if (args.file_type) {
		params.fileType = args.file_type;
	} else if (args.search_results) {
		params.num = args.search_results;
	}

	try {
		const response = await axios.get(
			'https://www.googleapis.com/customsearch/v1',
			{ params },
		);

		let items = [];

		for (const item of response.data.items) {
			items.push({
				title: item.title,
				url: item.link,
			});
			// console.log(item);
		}

		return items;

	} catch (error) {
		console.error(error.message);
	}

};

