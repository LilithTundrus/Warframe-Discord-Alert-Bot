'use strict';

// General options
const ver: string = '0.0.1';
const prod: boolean = false;
const debug: boolean = true;

// Discord Bot options
const botToken: string = 'MY_BOT_TOKEN';
const prefix: string = '$';
const inviteURL: string = 'MY_INVITE_URL';
const adminID: string = 'ID_OF_BOT_ADMIN';
const alertChannel: string = 'ID_OF_THE_CHANNEL_TO_MESSAGE';
const guildID: string = 'ID_OF_THE_SERVER';

// IDs of the roles for the bot to @mention when a specific alert is found
const guildRoleIDNitainAlert = 'ID_FOR_NITAIN_ALERT_ROLE';
const guildRoleIDCatalyst = 'ID_FOR_CATALYST_ALERT_ROLE';
const guildRoleIDReactor = 'ID_FOR_REACTOR_ALERT_ROLE';
const guildRoleIDForma = 'ID_FOR_FORMA_ALERT_ROLE';


// Warframe options
const warframeWorldsstateURL: string = 'http://content.warframe.com/dynamic/worldState.php';

export {
    ver, prod, debug,
    botToken, prefix, inviteURL,
    adminID, alertChannel, guildID,
    warframeWorldsstateURL, guildRoleIDNitainAlert,
    guildRoleIDCatalyst, guildRoleIDReactor,
    guildRoleIDForma
}