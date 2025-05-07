import { SlashCommandBuilder, AttachmentBuilder } from 'discord.js';
import { createCanvas } from 'canvas';

// ? Danh sách sự kiện có thể chúc
const EVENTS = [
    // * Tháng 1.
    { eventId: 1, nameVn: "Tết Dương Lịch", nameEn: "New Year's Day", value: "newYearDay" }, // 1/1 - Ngày đầu năm mới
    { eventId: 2, nameVn: "Tết Nguyên Đán", nameEn: "Lunar New Year", value: "lunarNewYearDay" }, // Tết Âm Lịch
    // * Tháng 2.
    { eventId: 3, nameVn: "Valentine", nameEn: "Valentine's Day", value: "valentinesDay" }, // 14/2 - Lễ tình nhân
    // * Tháng 3.
    { eventId: 4, nameVn: "Ngày Quốc tế Phụ nữ 8/3", nameEn: "International Women's Day", value: "womensday" }, // 8/3
    // * Tháng 4.
    // * Tháng 5.
    // * Tháng 6.
    // * Tháng 7.
    // * Tháng 8.
    // * Tháng 9.
    // * Tháng 10.
    // * Tháng 11.
    // * Tháng 12.
    { eventId: 5, nameVn: "Giáng Sinh", nameEn: "Christmas", value: "christmas" }, // 25/12 - Noel
    // * Sự kiện đặc biệt.
    { eventId: 6, nameVn: "Sinh nhật của tôi", nameEn: "My Birthday", value: "myBirthday" }, // Sinh nhật của chính mình
    { eventId: 7, nameVn: "Sinh nhật người đặc biệt", nameEn: "Special Someone's Birthday", value: "specialBirthday" } // Sinh nhật của người quan trọng
    // * Sự kiện khác (chỉ cần nhắc lại, không cần chúc hay tặng quà gì thêm).
];

export const data = new SlashCommandBuilder()
    .setName('greet')
    .setDescription('🎉 Gửi một lời chúc tới người đặc biệt của bạn!')
    .addStringOption(option =>
        option.setName('event')
            .setDescription('Chọn sự kiện muốn chúc')
            .setRequired(true)
            .addChoices(
                { name: 'Ngày Quốc tế Phụ nữ 8/3', value: 'womensday' },
                { name: 'Sinh nhật', value: 'birthday' },
                { name: 'Năm mới', value: 'newyear' },
                { name: 'Giáng sinh', value: 'christmas' }
            )
    )
    .addUserOption(option =>
        option.setName('user')
            .setDescription('Người bạn muốn chúc')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('message')
            .setDescription('Lời chúc dành cho họ')
            .setRequired(true)
    );

export async function execute(interaction) {
    const eventKey = interaction.options.getString('event');
    const user = interaction.options.getUser('user');
    const message = interaction.options.getString('message');
    // * Xoá toàn bộ dấu `|`
    const cleanMessage = message.replace(/\|/g, '');
    const username = user.username;
    // * Viết hoa chữ cái đầu trong tên
    const formattedUsername = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();

    // Xác định tên sự kiện từ danh sách EVENTS
    const eventName = EVENTS[eventKey] || "Sự kiện đặc biệt";

    const imageBuffer = await generateEventImage(formattedUsername, eventName, message);
    const attachment = new AttachmentBuilder(imageBuffer, { name: 'SPOILER_event_greeting.png' });

    try {
        // Gửi lời chúc vào kênh chung
        await interaction.reply({
            content: `🎉 **${interaction.user} chúc mừng ${eventName} đến ${user}!**\n💬 *"${cleanMessage}"*`,
            files: [attachment]
        });

        // Gửi lời chúc qua DM
        await user.send({
            content: `🎉 **${interaction.user.username} chúc bạn một ${eventName} vui vẻ!**\n💬 *"${cleanMessage}"*`,
            files: [attachment]
        });

        // Thông báo (chỉ nếu gửi DM thành công)
        await interaction.followUp({ content: `📩 Đã gửi lời chúc ${eventName} đến ${user.username} qua DM!`, ephemeral: true });

    } catch (error) {
        console.error(`❌ Không thể gửi tin nhắn DM cho ${user.username}:`, error);

        // Nếu gửi DM thất bại, thông báo lỗi (không dùng reply nữa, mà dùng followUp)
        await interaction.followUp({ content: `❌ Không thể gửi tin nhắn cho ${user.username}, có thể họ đã tắt DM từ bot.`, ephemeral: true });
    }
}

// Hàm vẽ ảnh chúc mừng
async function generateEventImage(username, eventName, message) {
    const width = 600;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Vẽ nền trắng.
    ctx.fillStyle = '#ffffff'; // Màu trắng.
    ctx.fillRect(0, 0, width, height);

    // Vẽ trái tim màu hồng.
    ctx.fillStyle = '#ff4b71';
    ctx.beginPath();
    ctx.moveTo(300, 100);
    ctx.bezierCurveTo(400, 10, 550, 200, 300, 350);
    ctx.bezierCurveTo(50, 200, 200, 10, 300, 100);
    ctx.fill();

    // * Viết tên sự kiện (Chữ màu nâu chàm)
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';

    ctx.lineWidth = 4;
    ctx.fillStyle = '#6b343f'; // Chữ màu tím nhạt (Thistle)
    ctx.fillText(`💖 Chúc mừng ${eventName}, ${username}! 💖`, width / 2, 50);

    // * Viết nội dung lời chúc
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';

    // * Chia nhỏ câu theo ký tự `|`
    const greetlines = message.split('|');

    let startY = 170;
    greetlines.forEach((line, i) => {
        ctx.fillStyle = '#ffffff';
        ctx.fillText(line.trim(), width / 2, startY + i * 25); // * Giữ khoảng cách dòng 25px
    });

    return canvas.toBuffer();
}
