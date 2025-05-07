import { readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { Collection, REST, Routes } from 'discord.js';
import 'dotenv/config';

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// 🔹 Hàm đệ quy lấy toàn bộ file `.js` trong thư mục `commands` (bao gồm thư mục con)
function getAllCommandFiles(dir) {
    let files = [];
    const entries = readdirSync(dir);

    for (const entry of entries) {
        const fullPath = join(dir, entry);
        if (statSync(fullPath).isDirectory()) {
            // Nếu là thư mục, gọi đệ quy
            files = files.concat(getAllCommandFiles(fullPath));
        } else if (extname(entry) === '.js') {
            // Nếu là file `.js`, thêm vào danh sách
            files.push(fullPath);
        }
    }
    return files;
}

// 🔹 Load toàn bộ commands
export async function loadCommands(client) {
    client.commands = new Collection();
    const commandFiles = getAllCommandFiles('./src/commands'); // ✅ Quét cả thư mục con
    const commands = [];

    for (const file of commandFiles) {
        try {
            const command = await import(`file://${process.cwd()}/${file}`);
            if (command.data && command.execute) {
                client.commands.set(command.data.name, command);
                commands.push(command.data.toJSON());
                console.log(`✅ Đã nạp vào lệnh: ${command.data.name}`);
            } else {
                console.warn(`❌ Lệnh ${file} không hợp lệ!`);
            }
        }
        catch (error) {
            console.error(`❌ Lỗi khi tải lệnh ${file}:`, error);
        }
    }

    // 🔹 Đăng ký lại lệnh với Discord
    try {
        console.log('🔄 Đang đăng ký lại lệnh mới...');
        const guilds = process.env.GUILD_IDS?.split(',').map(id => id.trim()) || [];
        for (const guildId of guilds) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
                { body: commands }
            );
            console.log(`✅ Đã đăng ký lệnh mới cho server: ${guildId}`);
        }
    } catch (error) {
        console.error('❌ Lỗi khi đăng ký lệnh mới:', error);
    }
}
