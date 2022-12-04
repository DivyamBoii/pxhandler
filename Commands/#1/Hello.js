const { Client, ChatInputCommandInteraction } = require("discord.js")
const { Reply, EditReply } = require("../../Systems/Reply") 

module.exports = {
    name: "hi",
    description: "Hay",
    category: "Information",
    BotPerms: ["Administrator"],
    UserPerms: ["Administrator"],
    DevOnly: false,

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction, client) {

        await interaction.deferReply()
        return EditReply(interaction, "✅", `${interaction.user} Hay, \`${client.ws.ping} ms\``)

    }
}

