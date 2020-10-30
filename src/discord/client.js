import { Client } from 'discord.js';

const client = new Client();
client.login(process.env.DISCORD_TOKEN);

export default client;
