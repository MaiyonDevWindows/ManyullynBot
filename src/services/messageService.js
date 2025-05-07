// ? Hàm thao tác với các tin nhắn nói chung.
// ? Hàm lấy tất cả tin nhắn trong Channel.
// * Hàm này có tác dụng giúp lấy và trả về 1 mảng tin nhắn có trong Channel.
export async function fetchAllMessagesInChannel(channel) {
    let allMessages = [];
    let lastId = null;
    while (true) {
        const fetchedMessages = await channel.messages.fetch({ limit: 100, before: lastId });
        if (fetchedMessages.size === 0) break; // Nếu không còn tin nhắn nào thì dừng lại
        allMessages.push(...fetchedMessages.values());
        lastId = fetchedMessages.last().id; // Lưu ID tin nhắn cuối cùng để lấy tiếp tin cũ hơn
    }
    return allMessages;
}

// ? Hàm đếm số lượng tin nhắn có trong Channel.
// * Hàm này sẽ gọi hàm fetchAllMessages() để lấy tất cả tin nhắn, sau đó trả về số lượng tin nhắn.
export async function countAllMessagesInChannel(channel) {
    const allMessages = await fetchAllMessagesInChannel(channel);
    return allMessages.length;
}

// ? Hàm thao tác với các tin nhắn gần đây.
// ? Hàm xóa tất cả tin nhắn trong Channel trong vòng 14 ngày.
// * - Hàm này sẽ xóa tất cả tin nhắn trong Channel trong vòng 14 ngày.
// * - Hàm này sẽ trả về số lượng tin nhắn đã xóa.
// * - Hàm này có thể tái sử dụng trong các Module khác.
export async function deleteAllRecentMessages(channel) {
    let totalDeleted = 0;
    try {
        let messages = await channel.messages.fetch({ limit: 100 });
        let deletableMessages = messages.filter(msg => (Date.now() - msg.createdTimestamp) < 1209600000);

        while (deletableMessages.size > 0) {
            const deleted = await channel.bulkDelete(deletableMessages, true).catch(err => {
                if (err.code !== 10008) console.error(err);
            });
            totalDeleted += deleted?.size || 0;
            messages = await channel.messages.fetch({ limit: 100 });
            deletableMessages = messages.filter(msg => (Date.now() - msg.createdTimestamp) < 1209600000);
        }
    } catch (error) {
        console.error('Lỗi khi xóa tin nhắn:', error);
    }
    return totalDeleted;
}