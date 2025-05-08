// ? Import các thư viện cần thiết.
import 'dotenv/config';
import { loadEvents } from './handlers/eventHandler.js';
import { loadCommands } from './handlers/commandHandler.js';
import { loadInteractions } from './handlers/interactionHandler.js';
import { Client, GatewayIntentBits } from 'discord.js';

// ? Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// ? Lệnh này sẽ chạy một lần mỗi khi bot online.
// * Load tất cả events, commands và interactions từ folder.
loadCommands(client);
loadEvents(client);
loadInteractions(client);

// ? Log in to Discord with your client's token
client.login(process.env.TOKEN);

export { client };
