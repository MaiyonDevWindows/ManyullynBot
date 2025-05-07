import { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } from 'discord.js';
import { joinVoiceChannel, getVoiceConnection } from '@discordjs/voice';

export const data = new SlashCommandBuilder()
    .setName('join_channel')
    .setDescription('Bảo bot tham gia voice channel của bạn.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Connect);

export async function execute(interaction) {
    const member = interaction.member;
    const channel = member.voice.channel;

    if (!channel) {
        return interaction.reply({
            content: '❌ Bạn phải vào một voice channel trước!',
            flags: MessageFlags.EPHEMERAL
        });
    }

    // Kiểm tra bot đã có trong kênh chưa
    const existingConnection = getVoiceConnection(interaction.guild.id);
    if (existingConnection) {
        return interaction.reply({
            content: 'ℹ️ Bot đã ở trong một voice channel!',
            flags: MessageFlags.EPHEMERAL
        });
    }

    try {
        // Kết nối bot vào voice channel
        joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });

        return interaction.reply({
            content: `✅ Đã tham gia voice channel **${channel.name}**!`
        });
    } catch (error) {
        console.error(error);
        return interaction.reply({
            content: '❌ Bot không thể tham gia voice channel!',
            flags: MessageFlags.EPHEMERAL
        });
    }
}
