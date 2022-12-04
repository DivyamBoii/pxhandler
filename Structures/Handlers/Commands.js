const { Perms } = require("../Validation/Permissions")
const { Client } = require("discord.js")
const ms = require("ms")
const colors = require('colors')

/**
 * @param { Client } client
 */
module.exports = async (client, PG, Ascii) => {

    /**
     *  commands loaded MAIN HEADLINE
     */
    const Table = new Ascii("Commands")
    Table.setBorder('│', '─', "▢", "▢");
    CommandsArray = []

    /**
     * fetching ALL commands inside /Commands/ folder
     */
    const CommandFiles = await PG(`${process.cwd()}/Commands/*/*.js`)

    CommandFiles.map(async (file) => {
        const command = require(file)

        /**
         *  module.exports = {
         *  name: "",                        [ IF NO NAME THEN SHOWING ERROR ] ⚠
         * }
         * 
         * How to Fix [  name: "" |  inside commands name allows starting ( Small-latter ) makesure to no gap each or next centence when starting ]
         * ex 1: name: "Hello" ❌          | name: "hello" ✅
         * ex 2: name: "hello everyone" ❌ | name: "hello_everyone" ✅ | name: "hello-everyone" ✅
         */
         
        if (!command.name) return Table.addRow(file.split("/")[7], "🔸 FAILED", "Missing A Name")


       /**
         *  module.exports = { 
         *  description: "",                [ IF NO description THEN SHOWING ERROR ] ⚠
         * }
         * 
         * How to Fix
         * ex : description "any thing about related this commands information" ✅
         */

        if (!command.context && !command.description) return Table.addRow(command.name, "🔸 FAILED", "Missing A Description")

        /**
         * @UserPerms 
         * Make sure to provide a valid permission You Can see all permission In this file 
         * 🔑 location ("./Structures/Validation/Permissions")
         * 
         * 
         * command.default_member_permissions = false ❔ [ if user permission not matching. commands_use_require_permission ] 
         * ?? = ❌ then user not see this commands. ✅ if user have commands_use_require_permission. Commands visible for user.  (Type: [ROLE])
         * 
         * 
         * command.default_member_permissions = true  ❔
         * ?? = everyone can see all commands. But user don't have commands_use_require_permission 
         *⚠ then throw the error you dot have permission and permission name ⚠
         */
        if (command.UserPerms)
        if (command.UserPerms.every(perms => Perms.includes(perms))) command.default_member_permissions = true 
        else return Table.addRow(command.name, "🔸 FAILED", "User Permission Is Invalid")

        client.commands.set(command.name, command)
        CommandsArray.push(command)

        /**
         * ?? if commands loaded Successfully then. Its showing Console.    
         */
        await Table.addRow(command.name, "🔹")

    })
    /**
     * load Full table. Commands loaded or not or any eror.
     */
    console.log(Table.toString().blue)

    /**
     * Bot @client 
     * Set application / commands [Global, Multi_Guild, Single_Guild] 
     */
    client.on("ready", () => {

        /**
         * Multi_Guild Application Commands loaded
         */
        //setInterval(() => { client.guilds.cache.forEach(guild => { guild.commands.set(CommandsArray) }) }, ms("5s")) 
        

        /**
         * global Application commands loaded
         * adding for slash commands id gate ----------?> | require this thing index.js for [ client.slashData = new Collection(); ] collection  || (</CommandName:${client.slashData.get("CommandName").id}>) ||
         */
         client.application.commands.set(CommandsArray).then(cmds => { cmds.toJSON().forEach(cmd => client.slashData.set(cmd.name, cmd)) })
    

        /**
         * single Guild Application Commands loaded
         */
        //client.guilds.cache.get("<Guild id>").commands.set(CommandsArray) 
    })
}