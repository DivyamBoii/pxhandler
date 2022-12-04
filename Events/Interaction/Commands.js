const { Client, CommandInteraction, InteractionType, EmbedBuilder } = require("discord.js")
const { ApplicationCommand } = InteractionType
const { Reply, EditReply } = require("../../Systems/Reply")
const { slash } = require(`../../Systems/onCoolDown`);
const emoji = require(`../../Botcore/emotes.json`)
const config = require(`../../Botcore/config.json`)
const colors = require('colors')

module.exports = {
    name: "interactionCreate",

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client 
     */

    async execute(interaction, client) {

        const { user, guild, commandName, member, type } = interaction

        if (!guild || user.bot) return
        if (type !== ApplicationCommand) return

        const command = client.commands.get(commandName)

        /**
         * If Commands Does not existe Then Delte The Commands. 
         * and Throw the Error ⚠"An error occurred while running the command!"⚠
         */
        if (!command) return Reply(interaction, "❌", `An error occurred while running the command!`, true) && client.commands.delete(commandName)

            /* ==============================< Userperms checking >============================= \\
            * if UserPerms !== Same current user perms Then ⚠ Error ⚠
            * How to Set user permission:  UserPerms: ["Administrator"], || Multi permissions set at a time. Like this = ["",""]
            */
            if (command.UserPerms && command.UserPerms.length !== 0) if (!member.permissions.has(command.UserPerms)) 
        return Reply(interaction, "❌", `You need \`${command.UserPerms.join(", ")}\` permission(s) to execute this command!`, true)

            /* ==============================< Botperms checking >============================= \\
            * if BotPerms !== Same Bot perms or bot dothave permissions Then ⚠ Error ⚠
            * How to Set Bot permission:  BotPerms: ["Administrator"], || Multi permissions set at a time. Like this = ["",""]
            */
            if (command.BotPerms && command.BotPerms.length !== 0) if (!guild.members.me.permissions.has(command.BotPerms)) 
            return Reply(interaction, "❌", `I need \`${command.BotPerms.join(", ")}\` permission(s) to execute this command!`, true)

            // ==============================< Toggle off >=============================\\
            if (command.toggleOff) {
              return await interaction.reply({
                ephemeral: true,
                embeds: [new EmbedBuilder()
                  .setTitle(`${emoji.x} **That Command Has Been Disabled By The Developers! Please Try Later.**`).setColor("Red")
                ]
              }).catch((e) => {
                console.log(e)
              });
            }

            // ==============================< On Mainenance Mode >============================= \\
            if (command.maintenance) {
              return await interaction.reply({
                ephemeral: true,
                content: `${emoji.x} **${command.name} command is on __Maintenance Mode__** try again later!`
              })
            }

            // ==============================< Owner Only >============================= \\            
            if (command.DevOnly) {
              const devs = config.OWNERIDS;
              if (!devs.includes(interaction.user.id)) return await interaction.reply({
                ephemeral: true,
                embeds: [new EmbedBuilder()
                  .setDescription(`${emoji.x} **You cannot use \`${slashCommand.name}\` command as this is a developer command.**`).setColor("Red")
                ]
              }).catch((e) => {
                console.log(String(e).grey)
              });
            }

            // ==============================< Only for offical guilds >============================= \\
            if (command.guildOnly) {
              const private = config.GuildID_1
                .concat(config.GuildID_2);
              if (!private.includes(interaction.guild.id)) {
                return interaction.reply({
                  ephemeral: true,
                  embeds: [
                    new EmbedBuilder()
                      .setTitle(`${emoji.x} ${interaction.user.username} You have entered an invalid command!`)
                      .setDescription(`The command \`${command.name}\` can only be used in the official server.`).setColor("Red")
                  ]
                })
              }
            }

        /**
         * ALLOWES Parameters Starting with  "interaction" then other Parameters
         * ⚠ Otherwise Commands Not working. Result error log ⚠
         * async execute(interaction, client)
         */
        command.execute(interaction, client)

    }
}