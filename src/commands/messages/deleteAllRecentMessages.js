// ? Module này có tác dụng xoá các tin nhắn gần đây trong kênh (Cụ thể là 14 ngày gần đây).
// * - Module này sẽ xóa tất cả tin nhắn trong Channel trong vòng 14 ngày.
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { handleDeleteAllRecentMessages } from '../../controllers/messageController.js';

// ? Phần Data của Slash Command.
export const data = new SlashCommandBuilder()
    .setName('delete_all_recent_messages')
    .setDescription('Xóa tất cả tin nhắn trong kênh trong vòng 14 ngày.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

// ? Phần Execute của Slash Command.
export async function execute(interaction) {
    return handleDeleteAllRecentMessages(interaction);
}