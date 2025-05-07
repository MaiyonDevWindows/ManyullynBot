import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Xem độ trễ của bot');

export async function execute(interaction) {
    const ping = interaction.client.ws.ping;    // Lấy WebSocket ping.
    await interaction.reply(`🏓 Pong! (Latency: **${ping}ms**)`);
}