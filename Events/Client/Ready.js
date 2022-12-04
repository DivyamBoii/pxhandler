const { Client, ActivityType } = require("discord.js")
const colors = require('colors')
const ms = require("ms")

module.exports = {
    name: "ready",

   /**
    * @param {Client} client 
    * @param {ActivityType} type
    */

    async execute(client) {
      const { user, ws } = client;
      const activities = [
        // types: PLAYING = 0, LISTENING = 2, WATCHING = 3, COMPETING = 4
        { name: `your project(s)`, type: 3 }
      ];
      let i = 0;

        /**
         * @client ActivityStatus 
         */

        setInterval(() => { 
          if (i >= activities.length) i = 0
        user.setActivity(activities[i]) }, ms("5s"))
        i++;

        console.log(`🔸 ${client.user.tag} Is Online`.brightCyan)
    }
}