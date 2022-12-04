const { Client } = require("discord.js")
const { Events } = require("../Validation/EventNames")
const fs = require("fs")

/**
 * @param {Client} client
 */
module.exports = async (client, PG, Ascii) => {
    /**
     * event loaded MAIN HEADLINE
     */
    const Table = new Ascii("Monitor Events Loaded")
    Table.setBorder('│', '─', "▢", "▢");

    /**
     * fetching ALL event inside /Events/ folder 
     */
    const EventFiles = await PG(`${process.cwd()}/Events/*/*.js`)

    EventFiles.map(async file => {
        
        const event = require(file)
        /**
         * module.exports = {
         *  name: "",       [ Must provide a valid event name ] 
         * }
         * 
         * ❕ You Can See all events name 
         * 🔑 location ("./Structures/Validation/EventNames")
         *  
         */
        if (!Events.includes(event.name) || !event.name) {
            const L = file.split("/")
            await Table.addRow(`${event.name || "MISSING"}`, `⛔ Event Name is either invalid or missing: ${L[6] + `/` + L[7]}`)
            return
        }

        if (event.once) client.once(event.name, (...args) => event.execute(...args, client))
        else client.on(event.name, (...args) => event.execute(...args, client))
        
        /**
         * if event loaded Successfully then. Its showing Console.
         */
        await Table.addRow(event.name, "✅")

    })

    /**
     * load Full table. event loaded or not or any eror.
     */
    console.log(Table.toString().red)


        //  Module

        let x = 0;
        fs.readdirSync(`${process.cwd()}/modules/`).filter((file) => file.endsWith('.js')).forEach((modules) => {
          const mod = require(`${process.cwd()}/modules/${modules}`)
          if (mod) mod.execute(client);
          x++;
          console.log(`Loaded ${modules.split(`.js`)[0]} Module`)
        })
        setTimeout(() => {
          console.log(`Loaded ${x} Modules`.bold)
        }, 2000)

}


