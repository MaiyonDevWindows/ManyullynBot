// ? Xóa tất cả tin nhắn trong kênh text hiện tại.
// * - Không xoá kênh rồi tạo lại, như thế sẽ mất cấu hình và dễ gây xoá trộn channels.
// * - Discord không cho phép xóa tin nhắn cũ hơn 14 ngày bằng Bulk Delete API.
// * => Vì vậy dùng fetch() để lấy tin nhắn, sau đó dùng Promise.all() để xóa song song.

// ! Lỗi.

// import { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, EmbedBuilder } from 'discord.js';

// export const data = new SlashCommandBuilder()
//     .setName('delete_all_messages')
//     .setDescription('Xóa một số lượng tin nhắn trong kênh text hiện tại.')
//     .addIntegerOption(option =>
//         option.setName('amount')
//             .setDescription('Số lượng tin nhắn cần xóa.')
//             .setMinValue(1) // Bắt buộc phải lớn hơn 0
//             .setRequired(true)
//     )
//     .addUserOption(option =>
//         option.setName('target')
//             .setDescription('Người dùng cần xóa tin nhắn.')
//     );

// export async function execute(interaction, isRecursive = false) {
//     const channel = interaction.channel;
//     const amount = interaction.options.getInteger('amount');
//     const target = interaction.options.getUser('target');
//     const user = interaction.user;
//     const member = interaction.guild.members.cache.get(user.id);

//     if (!member.permissions.has(PermissionFlagsBits.ManageMessages)) {
//         return interaction.reply({
//             content: '❌ Bạn không có quyền xóa tin nhắn!',
//             flags: MessageFlags.Ephemeral
//         });
//     }

//     if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
//         return interaction.reply({
//             content: '❌ Bot cần quyền "Quản lý tin nhắn" để xóa tin nhắn!',
//             flags: MessageFlags.Ephemeral
//         });
//     }

//     if (!channel.isTextBased()) {
//         return interaction.reply({
//             content: '❌ Lệnh này chỉ hoạt động trong kênh văn bản!',
//             flags: MessageFlags.Ephemeral
//         });
//     }

//     if (!isRecursive) await interaction.deferReply({ ephemeral: true });

//     let totalDeleted = 0;
//     let lastMessageId = null;

//     const deleteMessages = async () => {
//         if (totalDeleted >= amount) {
//             const clearEmbed = new EmbedBuilder()
//                 .setColor('#ff0000')
//                 .setDescription(`🗑️ Đã xóa ${totalDeleted} tin nhắn${target ? ` của ${target.username}` : ''}.`);
//             if (!isRecursive) await interaction.editReply({ embeds: [clearEmbed] });
//             return;
//         }

//         const fetchSize = Math.min(7, amount - totalDeleted);
//         const fetchedMessages = await channel.messages.fetch({ limit: fetchSize, before: lastMessageId });

//         let messagesToDelete = fetchedMessages;
//         if (target) {
//             messagesToDelete = messagesToDelete.filter(msg => msg.author.id === target.id);
//         }

//         const messagesArray = Array.from(messagesToDelete.values());
//         if (messagesArray.length === 0) return;

//         for (const msg of messagesArray) {
//             await msg.delete();
//             totalDeleted++;
//             console.log(`Đã xóa ${totalDeleted} tin nhắn`);
//             await new Promise(res => setTimeout(res, 300));
//         }

//         lastMessageId = messagesArray[messagesArray.length - 1]?.id;

//         console.log(`🔄 Gọi lại lệnh để tiếp tục xóa...`);
//         setTimeout(deleteMessages, 1500); // 🔥 Delay 1.5s rồi tiếp tục
//     };

//     deleteMessages();
// }
