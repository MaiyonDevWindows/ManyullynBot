import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Lấy avatar của bạn hoặc người khác')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('Chọn người cần lấy avatar')
            .setRequired(false)
    );

export async function execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const avatarURL = user.displayAvatarURL({ dynamic: true, size: 4096 });

    const embed = {
        color: 0x3498db,
        title: `Avatar của ${user.username}`,
        image: { url: avatarURL },
        footer: { text: `Yêu cầu bởi ${interaction.user.username}` }
    };

    await interaction.reply({ embeds: [embed] });
}
