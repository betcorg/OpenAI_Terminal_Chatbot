import 'dotenv/config';
import OpenAI from 'openai';
import chalk from 'chalk';
import readline from 'readline';
import config from './config.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let messages = [];

const {
    instructions,
    temperature,
    max_tokens,
    stream,
    model,
} = config;

if (instructions !== '') {
    messages.push({ role: "system", content: instructions });
}
async function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            messages.push({ role: "user", content: answer });
            resolve(answer);
        });
    });
}

async function main() {

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

        // const response = completion.choices[0].message.content;

        console.log('');
        let response = '';
        for await (const chunk of completion) {
       
            const chunkText = chunk.choices[0].delta.content;
            if (typeof(chunkText) === 'undefined') {
                console.log('');
            } else {
                process.stdout.write(chalk.blueBright(chunkText));
            }
            response += chunkText;
        }

        messages.push({ role: "assistant", content: response });
        // console.log('\x1b[34m%s\x1b[0m', '\n' + response);
    }
}
main();
