
import * as Discord from 'discord.js';

export function createRichEmbed(title: string, description: string) {
    let errorEmbed = new Discord.RichEmbed();
    errorEmbed.title = title;
    errorEmbed.description = description;
    errorEmbed.setColor(3447003);
    return errorEmbed;
}