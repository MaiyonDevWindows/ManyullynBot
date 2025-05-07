import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags, VoiceChannel, GuildEmoji, Client, TextChannel } from "discord.js";
import { client } from '../index.js'; // Điều chỉnh đường dẫn tùy theo thư mục

export const data = new SlashCommandBuilder()
    .setName('music_command')
    .setDescription('Bot Music Command System')
    .addSubcommand(subcommand => subcommand
        .setName('play')
        .setDescription('Play Music')
        .addStringOption(option => option
            .setName('query')
            .setDescription('Specify the music url you want to play.')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand => subcommand
        .setName('volume')
        .setDescription('Adjust the volume of the music.')
        .addNumberOption(option => option
            .setName('percentage')
            .setDescription('Specify the volume percentage.')
            .setMinValue(0)
            .setMaxValue(100)
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand => subcommand
        .setName('options')
        .setDescription('Options for music system.')
        .addStringOption(option => option
            .setName('options')
            .setDescription('Specify the options you want to use.')
            .setRequired(true)
            .addChoices(
                { name: 'queue', value: 'queue' },
                { name: 'skip', value: 'skip' },
                { name: 'pause', value: 'pause' },
                { name: 'resume', value: 'resume' },
                { name: 'stop', value: 'stop' },
                // { name: 'loop-single', value: 'loop-single' },
                { name: 'loop-queue', value: 'loop-queue' },
                { name: 'loop-all', value: 'loop-all' },
                { name: 'autoplay', value: 'autoplay' },
                // {name: 'shuffle', value: 'shuffle'},
                // {name: 'remove', value: 'remove'},
                // {name: 'move', value: 'move'},
            )
        )
    );

export async function execute(interaction) {
    const { options, member, guild, channel } = interaction;

    const subcommand = options.getSubcommand();
    const query = options.getString('query');
    const volume = options.getNumber('Percentage');
    const option = options.getString('options');
    const voiceChannel = member.voice.channel;

    const embed = new EmbedBuilder();

    if (!voiceChannel) {
        embed.setColor('Red').setDescription('❌ You must be in a voice channel to use this command!');
        return interaction.reply({ embeds: [embed] });
    }
    if (!member.voice.channelId == guild.members.me.voice.channelId) {
        embed.setColor('Red').setDescription(`❌ You cannot use the music system because it's already active in <#${guild.members.me.voice.channelId}>!`);
        return interaction.reply({ embeds: [embed] });
    }
    try {
        switch (subcommand) {
            case 'play':
                client.distube.play(voiceChannel, query, { TextChannel: channel, member: member });
                return interaction.reply({ content: 'Request received', flags: MessageFlags.EPHEMERAL });
            case 'volume':
                client.distube.setVolume(voiceChannel, volume);
                return interaction.reply({ content: `The volume level has been set to ${volume}%`, flags: MessageFlags.EPHEMERAL });
            case 'options':
                const queue = await client.distube.getQueue(voiceChannel);
                if (!queue) {
                    embed.setColor('Red').setDescription('❌ There is no music in the queue!');
                    return interaction.reply({ embeds: [embed], flags: MessageFlags.EPHEMERAL });
                }
                switch (option) {
                    case 'skip':
                        await queue.skip(voiceChannel);
                        embed.setColor('Blue').setDescription('⏭️ The current music has been skipped!');
                        return interaction.reply({ embeds: [embed], flags: MessageFlags.EPHEMERAL });
                    case 'stop':
                        await queue.stop(voiceChannel);
                        embed.setColor('Blue').setDescription('⏹️ The music has been stopped!');
                        return interaction.reply({ embeds: [embed], flags: MessageFlags.EPHEMERAL });
                    case 'resume':
                        await queue.resume(voiceChannel);
                        embed.setColor('Blue').setDescription('▶️ The music has been resumed!');
                        return interaction.reply({ embeds: [embed], flags: MessageFlags.EPHEMERAL });
                    case 'queue':
                        await (voiceChannel);
                        embed
                            .setColor('Blue')
                            .setDescription(
                                `${queue.songs
                                    .map(
                                        (song, id) => `\n**${id + 1}.** ${song.name} - \`${song.formattedDuration}\``
                                    )}`
                            );
                        return interaction.reply({ embeds: [queueEmbed], flags: MessageFlags.EPHEMERAL });
                    case 'loop-queue':
                        if (queue.repeatMode === 2) {
                            await client.distube.setRepeatMode(interaction, 0);
                            embed.setColor('Blue').setDescription(`\`🔁\` |
                                The track is not looped in mode: ** \`Queue\``
                            );
                            return interaction.reply({ embeds: [embed], flags: MessageFlags.EPHEMERAL });
                        } else {
                            await client.distube.setRepeatMode(interaction, 2);
                            embed.setColor('Blue').setDescription(`\`🔁\` |
                                The track is looped in mode: ** \`Queue\``
                            );
                            return interaction.reply({ embeds: [embed], flags: MessageFlags.EPHEMERAL });
                        }
                    case 'loop-all':
                        if (queue.repeatMode === 0) {
                            await client.distube.setRepeatMode(interaction, 1);
                            embed.setColor('Blue').setDescription(`\`🔁\` |
                                The track is not looped in mode: ** \`All\``
                            );
                            return interaction.reply({ embeds: [embed], flags: MessageFlags.EPHEMERAL });
                        } else {
                            await client.distube.setRepeatMode(interaction, 0);
                            embed.setColor('Blue').setDescription(`\`🔁\` |
                                The track is looped in mode: ** \`All\``
                            );
                            return interaction.reply({ embeds: [embed], flags: MessageFlags.EPHEMERAL });
                        }
                    case 'autoplay':
                        if (!queue.autoplay) {
                            await client.distube.toggleAutoplay(interaction);
                            embed.setColor('Blue').setDescription(`🔀 *Autoplay was: * \`Active\``);
                            return interaction.reply({ embeds: [embed], flags: MessageFlags.EPHEMERAL });
                        } else {
                            await client.distube.toggleAutoplay(interaction);
                            embed.setColor('Blue').setDescription(`🔀 *Autoplay was: * \`Inactive\``);
                            return interaction.reply({ embeds: [embed], flags: MessageFlags.EPHEMERAL });
                        }
                }
        }
    } catch (error) {
        console.error(error);
        embed.setColor('Red').setDescription('❌ An error occurred while executing the command!');
        return interaction.reply({ embeds: [embed], flags: MessageFlags.EPHEMERAL });
    }
}