import * as Discord from 'discord.js';

export function createRichError(errorMessage: string) {
    let errorEmbed = new Discord.RichEmbed();
    errorEmbed.title = 'Error';
    errorEmbed.description = errorMessage;
    errorEmbed.setColor(3447003);
    return errorEmbed;
}