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

import { DisTube } from 'distube';
import { SpotifyPlugin } from '@distube/spotify';
import { SoundCloudPlugin } from '@distube/soundcloud';
import { YtDlpPlugin } from '@distube/yt-dlp';


client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
        new SpotifyPlugin(),
        new SoundCloudPlugin(),
        new YtDlpPlugin()
    ]
});

const status = queue =>
    `**Volume:** \`${queue.volume}%\` | **Filter:** \`${queue.filters.names.join(', ') || 'Inactive'}\` |
    **Repeat:** \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'Queue' : 'Track') : 'Off'}\` |
    **Autoplay:** \`${queue.autoplay ? 'On' : 'Off'}\``;

client.distube
    .on('playSong', (queue, song) => {
        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('🎶 Now Playing')
            .setDescription(`**[${song.name}](${song.url})** - \`${song.formattedDuration}\`\n🎤 **Requested by:** ${song.user}\n${status(queue)}`)
            .setThumbnail(song.thumbnail);

        queue.textChannel.send({ embeds: [embed] }).catch(console.error);
    });

// ? Log in to Discord with your client's token
client.login(process.env.TOKEN);

export { client };
