import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';

export const data = new SlashCommandBuilder()
    .setName('leave_channel')
    .setDescription('Bảo bot rời khỏi voice channel.');

export async function execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);

    if (!connection) {
        return interaction.reply({
            content: '❌ Bot hiện không ở trong voice channel nào!',
            flags: MessageFlags.EPHEMERAL
        });
    }

    connection.destroy(); // Ngắt kết nối voice

    return interaction.reply({
        content: '👋 Bot đã rời khỏi voice channel!'
    });
}
