import 'dotenv/config.js';
import readline from 'readline';
import chalk from 'chalk';
import { config } from './config.js';

import * as openai from './src/openai/openai.js';

const { instructions, model } = config;

let messages = [];

if (instructions !== '') {

    messages.push({ role: "system", content: instructions });

}

const rl = readline.createInterface({

    input: process.stdin,
    output: process.stdout,

});

const getUserQuery = (query) => {

    return new Promise((resolve) => {
        rl.question(query, (userQuery) => {
            messages.push({ role: "user", content: userQuery });
            resolve(userQuery);
        });
    });

}

const main = async () => {

    let isPromptAlive = true;

    while (isPromptAlive) {

        await getUserQuery(chalk.bold.green(`\n${model} >>> `));
        console.log('');
        await openai.createChatCompletion(messages);
        // console.log(messages);
    }
    
}

main();
