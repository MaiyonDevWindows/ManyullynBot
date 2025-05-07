import { EmbedBuilder, PermissionFlagsBits, MessageFlags } from 'discord.js';
import { deleteAllRecentMessages, countAllMessagesInChannel } from '../services/messageService.js';

// ? Hàm xử lý việc xóa tất cả tin nhắn gần đây trong kênh.
export async function handleDeleteAllRecentMessages(interaction) {
    // * Lấy thông tin cơ bản từ Interaction.
    // * - User, Member, Channel.
    const channel = interaction.channel;
    const user = interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    // * Kiểm tra quyền hạn của Member, Bot.
    // * - Member cần có quyền "Quản lý tin nhắn".
    // * - Bot cần có quyền "Quản lý tin nhắn".
    // * - Channel cần là kênh văn bản.
    if (!member.permissions.has('ManageMessages')) {
        return interaction.reply({
            content: '❌ Bạn không có quyền xóa tin nhắn!',
            flags: MessageFlags.EPHEMERAL
        });
    }

    if (!interaction.guild.members.me.permissions.has('ManageMessages')) {
        return interaction.reply({
            content: '❌ Bot cần quyền "Quản lý tin nhắn" để xóa tin nhắn!',
            flags: MessageFlags.EPHEMERAL
        });
    }

    if (!channel.isTextBased()) {
        return interaction.reply({
            content: '❌ Lệnh này chỉ hoạt động trong kênh văn bản!',
            flags: MessageFlags.EPHEMERAL
        });
    }

    await interaction.deferReply({ flags: MessageFlags.EPHEMERAL });

    // * Thực hiện xóa tất cả các tin nhắn gần đây.
    // * - Gọi hàm xóa tất cả các tin nhắn gần đây (trong vòng 14 ngày) trong Channel.
    // * - Trả về số lượng tin nhắn đã xóa.
    try {
        const deletedCount = await deleteAllRecentMessages(channel);
        const clearEmbed = new EmbedBuilder()
            .setColor('#00ff00')
            .setDescription(`🗑️ Đã xóa ${deletedCount} tin nhắn trong vòng 14 ngày!`);

        await interaction.editReply({ embeds: [clearEmbed] });
    } catch (error) {
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: '❌ Xảy ra lỗi khi xóa tin nhắn!',
                flags: MessageFlags.EPHEMERAL
            }).catch(() => { });
        } else {
            await interaction.followUp({
                content: '❌ Xảy ra lỗi khi xóa tin nhắn!',
                flags: MessageFlags.EPHEMERAL
            }).catch(() => { });
        }
    }
}

// ? Hàm xử lý việc đếm tất cả tin nhắn trong kênh.
export async function handleCountAllMessages(interaction) {
    const channel = interaction.channel;
    // Kiểm tra quyền bot
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.READ_MESSAGE_HISTORY)) {
        return interaction.reply({ content: '❌ Bot cần quyền "Đọc lịch sử tin nhắn"!', flags: MessageFlags.EPHEMERAL });
    }
    await interaction.deferReply(); // Trả lời tạm thời để tránh timeout
    try {
        const countMessages = await countAllMessagesInChannel(channel);
        await interaction.editReply(`✅ Đã check được tổng cộng **${countMessages}** tin nhắn từ kênh này.`);
    } catch (error) {
        console.error(error);
        await interaction.editReply('❌ Xảy ra lỗi khi lấy tin nhắn!');
    }
}