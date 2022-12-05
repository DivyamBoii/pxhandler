const { Client } = require("discord.js")
const colors = require('colors')
const config = require(`../../Botcore/config.json`)
const mongoose = require("mongoose"); const mongo = config.DATABASE

module.exports = {
    name: "ready",

    /**
     * @param {Client} client 
     * @param {mongoose} mongo
     */

    async execute(client) {
        
        /**
         * mongodb Database for store data 
         * multi guild.
         */
        if (!mongo) return
        mongoose.connect(config.DATABASE || process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true
        }).then(() => { console.log("🔹 Database Connected!".red) }).catch(err => console.log(err))
    }
}
