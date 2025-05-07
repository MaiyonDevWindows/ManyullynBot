import { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('leave_server')
    .setDescription('Yêu cầu bot rời khỏi server hiện tại.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
    const guild = interaction.guild;
    const user = interaction.user;
    const member = guild.members.cache.get(user.id);

    if (!member.permissions.has(PermissionFlagsBits.Administrator)) {
        return interaction.reply({
            content: '❌ Bạn không có quyền yêu cầu bot rời khỏi server!',
            flags: MessageFlags.EPHEMERAL
        });
    }

    await interaction.reply({
        content: `👋 Bot đã rời khỏi server **${guild.name}**...`,
        flags: MessageFlags.EPHEMERAL
    });

    try {
        await guild.leave();
    } catch (error) {
        console.error('Lỗi khi rời server:', error);
    }
}
