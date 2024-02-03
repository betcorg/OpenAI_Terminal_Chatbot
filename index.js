import 'dotenv/config.js';
import readline from 'readline';
import chalk from 'chalk';
import {config} from './config.js';

import * as openai from './src/openai/openai.js';

const {instructions, model} = config;

let messages = [];

if (instructions !== '') {
    messages.push({ role: "system", content: instructions });
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const askQuestion = (question) => {
    return new Promise((resolve) => {
        rl.question(question, (userQuery) => {
            messages.push({ role: "user", content: userQuery });
            resolve(userQuery);
        });
    });
}

const main = async () => {

    let keepAsking = true;

    while (keepAsking) {
        await askQuestion(chalk.bold.green(`\n${model} >>> `));
        console.log('');
        await openai.createChatCompletion(messages);
    }
}

main();
