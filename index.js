import 'dotenv/config';
import OpenAI from 'openai';
import chalk from 'chalk';
import { marked } from 'marked';
import { markedTerminal } from 'marked-terminal';
import readline from 'readline';
import config from './config.js';

// Openai configs
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const {
    instructions,
    temperature,
    max_tokens,
    stream,
    model,
} = config;

let messages = [];

if (instructions !== '') {
    messages.push({ role: "system", content: instructions });
}

// Formatter configs
const mtOptions = {
    code: chalk.green,
};

marked.use(markedTerminal(mtOptions));

// Readline interface configs
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const askQuestion = (question) => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            messages.push({ role: "user", content: answer });
            resolve(answer);
        });
    });
}


let codeBlock = [];
let codeLine = [];
let response = '';

const openingPattern = /```/;
const closingPattern = /``/;
const codeDelimiter = /`/;



const main = async () => {

    let keepAsking = true;
    while (keepAsking) {
        await askQuestion(chalk.bold.green(`\n${model} >>> `));

        const completion = await openai.chat.completions.create({
            messages,
            model,
            max_tokens,
            temperature,
            stream,
        });

        console.log('');

        for await (const chunk of completion) {

            const textChunk = chunk.choices[0].delta.content;

            if (typeof (textChunk) === 'undefined') {
                console.log('');

            } else {
                
                // Handle code block formatting
                if (openingPattern.test(textChunk)) {

                    codeBlock.push(textChunk);
                    response += textChunk;
    
                } else if (codeBlock.length > 0) {
    
                    if (closingPattern.test(textChunk)) {
                        codeBlock.push(`${textChunk}\``);
                        const formattedCodeBlock = marked.parse(codeBlock.join(''));
                        process.stdout.write(chalk.bold(formattedCodeBlock));
                        response += textChunk;
                        codeBlock = [];
    
                    } else {
                        codeBlock.push(textChunk);
                        response += textChunk;
                    }
    
                } else if (textChunk.includes('`\n')) {
                    response += textChunk;
    
                } else {
    
                    // Handle code line formatting
                    if (codeLine.length === 0 && codeDelimiter.test(textChunk)) {
    
                        codeLine.push(textChunk);
                        response += textChunk;
    
                    } else if (codeLine.length > 0 && codeDelimiter.test(textChunk)) {
                        codeLine.push(textChunk);
                        // const formattedCodeLine = marked.parse(codeLine.join(''));
                        process.stdout.write(chalk.bold.magentaBright(codeLine.join('')));
                        response += textChunk;
                        codeLine = [];
    
                    } else {
    
                        if (codeLine.length > 0) {
                            codeLine.push(textChunk);
                            response += textChunk;
                        } else {
                            process.stdout.write(chalk.white(textChunk));
                            response += textChunk;
                        }
                    }
                }

            }
        }
        messages.push({ role: "assistant", content: response });
    }
}




main();
