import { readdirSync } from 'fs';
import { resolve } from 'path';

export function loadEvents(client) {
    const eventsPath = resolve('./src/events'); // Sửa đường dẫn tuyệt đối
    const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        import(`../events/${file}`).then(event => {
            if (event.default.once) {
                client.once(event.default.name, (...args) => event.default.execute(client, ...args));
            } else {
                client.on(event.default.name, (...args) => event.default.execute(client, ...args));
            }
            console.log(`✅ Đã nạp vào sự kiện: ${event.default.name}`);
        }).catch(error => console.error(`❌ Lỗi khi nạp sự kiện ${file}:`, error));
    }
}
