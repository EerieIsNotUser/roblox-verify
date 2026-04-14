require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ]
});

const GUILD_ID = process.env.DISCORD_GUILD_ID;
const VERIFIED_ROLE_ID = process.env.DISCORD_VERIFIED_ROLE_ID;
const WEBSITE_URL = process.env.WEBSITE_URL || 'http://localhost:3000';

const commands = [
  new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Link your Roblox account to Discord')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

async function registerCommands(clientId) {
  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(clientId, GUILD_ID),
      { body: commands }
    );
    console.log('Slash commands registered!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

client.once('ready', async () => {
  console.log(`Bot is online as ${client.user.tag}`);
  await registerCommands(client.user.id);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'verify') {
    const discordId = interaction.user.id;

    // Check if already verified
    const { data: existing } = await supabase
      .from('verified_users')
      .select('*')
      .eq('discord_id', discordId)
      .single();

    if (existing) {
      return interaction.reply({
        content: `✅ You are already verified as **${existing.roblox_username}**!`,
        ephemeral: true
      });
    }

    // Generate a unique token
    const token = crypto.randomBytes(16).toString('hex');
    const code = `verify-${crypto.randomBytes(4).toString('hex')}`;

    // Save to database
    await supabase.from('pending_verifications').upsert({
      token,
      discord_id: discordId,
      code,
    });

    // Send the verification link
    await interaction.reply({
      content: `👋 Hey! To verify your Roblox account, click the link below:\n\n🔗 ${WEBSITE_URL}/verify?token=${token}\n\n1. Click the link\n2. Make sure you are a member of the Roblox group\n3. Enter your Roblox username and click verify!`,
      ephemeral: true
    });
  }
});

async function assignVerifiedRole(discordId, robloxUsername) {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const member = await guild.members.fetch(discordId);

    // Assign verified role
    await member.roles.add(VERIFIED_ROLE_ID);

    // Change nickname to Roblox username
    await member.setNickname(robloxUsername);

    console.log(`Verified ${discordId} as ${robloxUsername}`);
    return true;
  } catch (error) {
    console.error('Error assigning role:', error);
    return false;
  }
}

module.exports = { assignVerifiedRole };

client.login(process.env.DISCORD_BOT_TOKEN);