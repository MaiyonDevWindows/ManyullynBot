// ? Module này có tác dụng đếm tất cả tin nhắn trong kênh hiện tại.
import { SlashCommandBuilder } from 'discord.js';
import { handleCountAllMessages } from '../../controllers/messageController.js';

// ? Phần Data của Slash Command.
export const data = new SlashCommandBuilder()
    .setName('count_all_messages')
    .setDescription('Lấy tất cả tin nhắn trong kênh hiện tại.');


// ? Phần Execute của Slash Command.
export async function execute(interaction) {
    return handleCountAllMessages(interaction);
}