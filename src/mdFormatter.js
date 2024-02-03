import chalk from 'chalk';
import { marked } from 'marked';
import { markedTerminal } from 'marked-terminal';

// Formatter configs
const mtOptions = {
    code: chalk.green,
};

marked.use(markedTerminal(mtOptions));

let codeBlock = [];
let codeLine = [];
let response = '';

const openingPattern = /```/;
const closingPattern = /``/;
const codeDelimiter = /`/;

export const chunkFormatter = async (textChunk) => {

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

    return response;
}
