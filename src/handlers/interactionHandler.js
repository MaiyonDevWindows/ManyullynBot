export function loadInteractions(client) {
    client.on('interactionCreate', async (interaction) => {
        console.log(`📩 Nhận interaction từ: ${interaction.user.tag}, Lệnh: ${interaction.commandName}`);

        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) {
            console.error(`❌ Không tìm thấy lệnh: ${interaction.commandName}`);
            return;
        }

        try {
            await command.execute(interaction);
            console.log(`✅ Lệnh ${interaction.commandName} đã được thực thi!`);
        } catch (error) {
            console.error(`❌ Lỗi khi thực hiện lệnh ${interaction.commandName}:`, error);
            await interaction.reply({ content: '❌ Đã xảy ra lỗi khi chạy lệnh!', ephemeral: true });
        }
    });
}
