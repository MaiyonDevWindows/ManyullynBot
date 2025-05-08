export default {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`🚀 Bot đã được deploy thành công và online để sẵn sàng phục vụ: ${client.user.tag}`);

        client.user.setPresence({
            // Type 3 = Watching
            activities: [{ name: 'Hentaiz.vn', type: 3 }],
            status: 'online'
        });

        console.log(`Bot 🤖 đã được thêm vào và hoạt động ở ${client.guilds.cache.size} servers:`);
        client.guilds.cache.forEach(guild => {
            console.log(`🖥️  ${guild.name} (Server ID: ${guild.id})`);
        });
    }
};