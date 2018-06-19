import * as Discord from 'discord.js';
import * as request from 'request-promise';
import { alertChannel } from './config';

export function initScheduler(client: Discord.Client, ) {
    setInterval(() => {
        request.get('https://www.google.com')
            .then((results) => {
                let discordChannel: any = client.channels.get(alertChannel);
                discordChannel.send(`Hey, I got ${results.length}`);
            })
    }, 10000)
}