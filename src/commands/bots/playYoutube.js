// ! Lỗi.

// import { SlashCommandBuilder, MessageFlags } from 'discord.js';
// import { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus } from '@discordjs/voice';
// import ytdl from 'ytdl-core-discord';

// export const data = new SlashCommandBuilder()
//     .setName('play')
//     .setDescription('Phát một bài hát từ YouTube.')
//     .addStringOption(option =>
//         option.setName('url')
//             .setDescription('Link YouTube của bài hát.')
//             .setRequired(true)
//     );

// export async function execute(interaction) {
//     const url = interaction.options.getString('url');
//     const member = interaction.member;
//     const channel = member.voice.channel;

//     if (!channel) {
//         return interaction.reply({
//             content: '❌ Bạn phải vào một voice channel trước!',
//             flags: MessageFlags.EPHEMERAL
//         });
//     }

//     if (!ytdl.validateURL(url)) {
//         return interaction.reply({
//             content: '❌ Link YouTube không hợp lệ!',
//             flags: MessageFlags.EPHEMERAL
//         });
//     }

//     await interaction.deferReply();

//     try {
//         let connection = getVoiceConnection(interaction.guild.id);

//         if (!connection) {
//             connection = joinVoiceChannel({
//                 channelId: channel.id,
//                 guildId: channel.guild.id,
//                 adapterCreator: channel.guild.voiceAdapterCreator
//             });
//         }

//         const stream = await ytdl(url, { filter: "audioonly", quality: "highestaudio" });
//         const resource = createAudioResource(stream);
//         const player = createAudioPlayer();

//         player.play(resource);
//         connection.subscribe(player);

//         player.on(AudioPlayerStatus.Idle, () => {
//             connection.destroy(); // Tự thoát sau khi phát xong
//         });

//         return interaction.editReply(`🎵 Đang phát: **${url}**`);
//     } catch (error) {
//         console.error(error);
//         return interaction.editReply({
//             content: '❌ Xảy ra lỗi khi phát nhạc!',
//             flags: MessageFlags.EPHEMERAL
//         });
//     }
// }
