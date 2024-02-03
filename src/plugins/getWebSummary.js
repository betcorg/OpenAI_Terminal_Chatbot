import axios from 'axios';

export const get_webpage_summary = {
    "type": "function",
    "function": {
        "name": "get_webpage_summary",
        "description": "Get a webpage summary from a given url",
        "parameters": {
            "type": "object",
            "properties": {
                "url": {
                    "type": "string",
                    "description": "The url of the webpage to be summarised",
                },
                "sentences_number":
                {
                    "type": "string",
                    "description": "The number of sentences the summary will have",
                },
            },
            "required": ["url", "sentences_number"],
        },
    }
}

export const getWebPageSummary = async (args) => {

    const {url, sentences_number} = args;

    const encodedParams = new URLSearchParams();
    encodedParams.set('url', url);
    encodedParams.set('sentnum', sentences_number);

    const options = {
        method: 'POST',
        url: 'https://textanalysis-text-summarization.p.rapidapi.com/text-summarizer-url',
        headers: {
            'X-RapidAPI-Key': process.env.X_RAPID_API_KEY,
            'X-RapidAPI-Host': 'textanalysis-text-summarization.p.rapidapi.com',
            'content-type': 'application/x-www-form-urlencoded',
        },
        data: encodedParams,
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error.message);
    }
}