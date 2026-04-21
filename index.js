const { Client, GatewayIntentBits, ComponentType, ButtonStyle, MessageFlags, REST, Routes, SlashCommandBuilder } = require('discord.js')
require('dotenv').config()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
})

const STAFF_ROLE_ID = '1491683215549923459'
const DEV_ROLE_ID = '1491683819923701790'
const PING_ROLE_ID = '1495670066203590796'

function hasStaffRole(message) {
  return message.member.roles.cache.has(STAFF_ROLE_ID) || message.member.roles.cache.has(DEV_ROLE_ID)
}

const commands = [
  new SlashCommandBuilder()
    .setName('update')
    .setDescription('Post a game update')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Title of the update')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('desc')
        .setDescription('Description of the update')
        .setRequired(true)
    )
    .addBooleanOption(option =>
      option.setName('ping')
        .setDescription('Ping update role?')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('extra')
        .setDescription('Any extra info (optional)')
        .setRequired(false)
    )
].map(command => command.toJSON())

client.once('clientReady', async () => {
  console.log(`Logged in as ${client.user.tag}`)
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN)
  try {
    console.log('Registering slash commands...')
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands })
    console.log('Slash commands registered!')
  } catch (error) {
    console.error('Failed to register commands:', error)
  }
})

client.on('interactionCreate', async interaction => {
  if (interaction.isButton()) {
    const roleMap = {
      role_tag: '1495624606730682428',
      role_pings: '1495670066203590796'
    }

    const roleId = roleMap[interaction.customId]
    if (!roleId) return

    const member = interaction.member
    const role = interaction.guild.roles.cache.get(roleId)

    if (!role) return interaction.reply({ content: 'Role not found.', ephemeral: true })

    if (member.roles.cache.has(roleId)) {
      await member.roles.remove(role)
      await interaction.reply({ content: `Removed <@&${roleId}>.`, ephemeral: true })
    } else {
      await member.roles.add(role)
      await interaction.reply({ content: `Added <@&${roleId}>!`, ephemeral: true })
    }
    return
  }

  if (interaction.isChatInputCommand() && interaction.commandName === 'update') {
    const member = interaction.member
    const hasPerms = member.roles.cache.has(STAFF_ROLE_ID) || member.roles.cache.has(DEV_ROLE_ID)

    if (!hasPerms) {
      return interaction.reply({ content: 'You do not have permission to post updates.', ephemeral: true })
    }

    const title = interaction.options.getString('title')
    const desc = interaction.options.getString('desc')
    const ping = interaction.options.getBoolean('ping')
    const extra = interaction.options.getString('extra')

    const embedComponents = [
      {
        type: ComponentType.TextDisplay,
        content: `# 📢 ${title}`
      },
      {
        type: ComponentType.Separator
      },
      {
        type: ComponentType.TextDisplay,
        content: desc
      }
    ]

    if (extra) {
      embedComponents.push({ type: ComponentType.Separator })
      embedComponents.push({
        type: ComponentType.TextDisplay,
        content: `### 📝 Extra Info\n${extra}`
      })
    }

    embedComponents.push({ type: ComponentType.Separator })
    embedComponents.push({
      type: ComponentType.TextDisplay,
      content: `*Posted by <@${interaction.user.id}> • <t:${Math.floor(Date.now() / 1000)}:F>*`
    })

    try {
      await interaction.reply({ content: '✅ Update posted!', ephemeral: true })

      await interaction.channel.send({
        content: ping ? `<@&${PING_ROLE_ID}>` : undefined,
        flags: MessageFlags.IsComponentsV2,
        components: [
          {
            type: ComponentType.Container,
            components: embedComponents
          }
        ]
      })
    } catch (err) {
      console.error('Failed to post update:', err)
    }
  }
})

client.on('messageCreate', async message => {
  if (message.author.bot) return

  if (message.content === '!sendembed') {
    if (!hasStaffRole(message)) return message.reply({ content: 'You do not have permission to use this command.' })
    await message.channel.send({
      flags: MessageFlags.IsComponentsV2,
      components: [
        {
          type: ComponentType.Container,
          components: [
            {
              type: ComponentType.Section,
              components: [
                { type: ComponentType.TextDisplay, content: '## <:windowslogo:1495437600364826724> Steam / PC' },
                { type: ComponentType.TextDisplay, content: 'Extract the downloaded zip file and run \n`VR.bat`, or\n`SCREENMODE.bat` Either one works!' }
              ],
              accessory: {
                type: ComponentType.Button,
                label: 'Download',
                style: ButtonStyle.Link,
                url: 'https://nothing.com',
                emoji: { name: '💾' }
              }
            }
          ]
        },
        {
          type: ComponentType.Container,
          components: [
            {
              type: ComponentType.Section,
              components: [
                { type: ComponentType.TextDisplay, content: '## <:androidlogo:1495438460297941002> META' },
                { type: ComponentType.TextDisplay, content: 'Go to the download link and join the org, once done, install the game in your headset.' }
              ],
              accessory: {
                type: ComponentType.Button,
                label: 'Download',
                style: ButtonStyle.Link,
                url: 'https://nothing.com',
                emoji: { name: '💾' }
              }
            }
          ]
        },
        {
          type: ComponentType.Container,
          components: [
            {
              type: ComponentType.Section,
              components: [
                { type: ComponentType.TextDisplay, content: '## <:applelogo:1495438113034469417> iOS' },
                { type: ComponentType.TextDisplay, content: 'No current build for iOS yet.' }
              ],
              accessory: {
                type: ComponentType.Button,
                label: 'Download',
                style: ButtonStyle.Link,
                url: 'https://nothing.com',
                emoji: { name: '💾' }
              }
            }
          ]
        }
      ]
    })
  }

  if (message.content === '!sendcontrib') {
    if (!hasStaffRole(message)) return message.reply({ content: 'You do not have permission to use this command.' })
    await message.channel.send({
      flags: MessageFlags.IsComponentsV2,
      components: [
        {
          type: ComponentType.Container,
          components: [
            { type: ComponentType.TextDisplay, content: '# Credits & Contributors' },
            { type: ComponentType.Separator },
            { type: ComponentType.TextDisplay, content: '### 👑 Owner\n<@370951912696053760>' },
            { type: ComponentType.Separator },
            { type: ComponentType.TextDisplay, content: '### 🔨 Builders & Contributors' },
            { type: ComponentType.TextDisplay, content: '<@1290397084154859564> — Helped/Basically Made The Servers And Game Logic Possible' },
            { type: ComponentType.TextDisplay, content: '<@810165054019600387> — Brought Back Rec Room Legacy After It Was Canceled' },
            { type: ComponentType.TextDisplay, content: '<@370951912696053760> — Had The Original Idea, Tried To Make It Possible As Basically One Dev' },
            { type: ComponentType.TextDisplay, content: '<@597393930438311937> — Original Helper Dev, Worked On The OG Logic Before It Was Canceled But Is Now Back' },
            { type: ComponentType.Separator },
            { type: ComponentType.TextDisplay, content: '### 🛡️ Staff & Helpers\n*They are making RRL a great place, better than the hells of Radium. Oh God.*' },
            { type: ComponentType.TextDisplay, content: '<@1012815068318142494> , <@1376641597025812480> , <@857414684977659904> , <@1426341585120919594> , <@1311176045407375362>' },
            { type: ComponentType.TextDisplay, content: '*I can\'t forget everyone apart of these teams.*\n<@&1491683819923701790> & <@&1491683896776196296>' },
            { type: ComponentType.Separator },
            { type: ComponentType.TextDisplay, content: '*"I just decided to make this to make sure everyone gets known properly considering the work they\'ve done to shape RRL to its best it\'s ever been."*\n— Kinetic' }
          ]
        }
      ]
    })
  }

  if (message.content === '!roleing') {
    if (!hasStaffRole(message)) return message.reply({ content: 'You do not have permission to use this command.' })
    await message.channel.send({
      flags: MessageFlags.IsComponentsV2,
      components: [
        {
          type: ComponentType.Container,
          components: [
            { type: ComponentType.TextDisplay, content: '# 🎭 Self Roles' },
            { type: ComponentType.Separator },
            {
              type: ComponentType.Section,
              components: [{ type: ComponentType.TextDisplay, content: '### <@&1495624606730682428>\nUse the server tag if you choose to have this role.' }],
              accessory: { type: ComponentType.Button, label: 'Get Role', style: ButtonStyle.Success, custom_id: 'role_tag' }
            },
            { type: ComponentType.Separator },
            {
              type: ComponentType.Section,
              components: [{ type: ComponentType.TextDisplay, content: '### <@&1495670066203590796>\nGet pinged when something is posted in <#1491702133790343218>.' }],
              accessory: { type: ComponentType.Button, label: 'Get Role', style: ButtonStyle.Primary, custom_id: 'role_pings' }
            }
          ]
        }
      ]
    })
  }

  if (message.content === '!sendrules') {
    if (!hasStaffRole(message)) return message.reply({ content: 'You do not have permission to use this command.' })
    await message.channel.send({
      flags: MessageFlags.IsComponentsV2,
      components: [
        {
          type: ComponentType.Container,
          components: [
            { type: ComponentType.TextDisplay, content: '# 📜 Server Rules' },
            { type: ComponentType.TextDisplay, content: '*This is a server for all ages (13+). Be a decent human being and we\'ll get along just fine.*' },
            { type: ComponentType.Separator },
            { type: ComponentType.TextDisplay, content: '### 1. Be Respectful\nTreat everyone with basic respect. No harassment, bullying, targeted insults, or general nastiness toward any member — staff or otherwise.' },
            { type: ComponentType.Separator },
            { type: ComponentType.TextDisplay, content: '### 2. No NSFW Content\nThis server is open to all ages. **No sexual, graphic, or otherwise inappropriate content anywhere, ever.** This includes profile pictures, usernames, and links.' },
            { type: ComponentType.Separator },
            { type: ComponentType.TextDisplay, content: '### 3. No Racism or Discrimination\nRacist, homophobic, transphobic, sexist, or any other discriminatory language or content is an instant ban. No exceptions. No "it was just a joke" excuses.' },
            { type: ComponentType.Separator },
            { type: ComponentType.TextDisplay, content: '### 4. No Spamming\nDon\'t flood channels with repeated messages, excessive caps, walls of emojis, or copy-pasted nonsense. Keep conversations readable.' },
            { type: ComponentType.Separator },
            { type: ComponentType.TextDisplay, content: '### 5. No Self Promotion or Advertising\nDon\'t advertise other Discord servers, YouTube channels, social media, or any other external content without staff permission.' },
            { type: ComponentType.Separator },
            { type: ComponentType.TextDisplay, content: '### 6. Keep Topics in the Right Channels\nUse channels for what they\'re meant for. Don\'t bring game discussion into off-topic and vice versa. Check the channel description if you\'re unsure.' },
            { type: ComponentType.Separator },
            { type: ComponentType.TextDisplay, content: '### 7. No Doxxing or Privacy Violations\nDo not share anyone\'s personal information — real name, address, phone number, social media, or anything else — without their explicit consent. This is an instant permanent ban.' },
            { type: ComponentType.Separator },
            { type: ComponentType.TextDisplay, content: '### 8. No Impersonation\nDon\'t pretend to be other members, staff, or public figures. This includes similar usernames, copying profile pictures, or claiming to represent the RRL team.' },
            { type: ComponentType.Separator },
            { type: ComponentType.TextDisplay, content: '### 9. No Exploiting or Cheating\nDon\'t discuss, share, or promote cheats, exploits, or hacks for RRL or any other game in this server. Keep it fair for everyone.' },
            { type: ComponentType.Separator },
            { type: ComponentType.TextDisplay, content: '### 10. Listen to Staff\nIf a staff member asks you to stop doing something, stop. If you disagree with a decision, bring it up calmly in the appropriate channel — don\'t argue in public or cause a scene.' },
            { type: ComponentType.Separator },
            { type: ComponentType.TextDisplay, content: '*Failure to follow these rules will result in warnings, mutes, kicks, or bans depending on severity. Staff have the final say.\nIf you see something breaking the rules, ping or DM a staff member.*' }
          ]
        }
      ]
    })
  }
  if (message.content === '!formlab') {
    if (!hasStaffRole(message)) return message.reply({ content: 'You do not have permission to use this command.' })
    await message.channel.send({
      flags: MessageFlags.IsComponentsV2,
      components: [
        {
          type: ComponentType.Container,
          components: [
            {
              type: ComponentType.Section,
              components: [
                {
                  type: ComponentType.TextDisplay,
                  content: '# 🧪 Research Lab Application'
                },
                {
                  type: ComponentType.TextDisplay,
                  content: 'If you want to be apart of <@&1491683819923701790>, fill out this form.\nStaff will get to you shortly.'
                }
              ],
              accessory: {
                type: ComponentType.Button,
                label: 'Apply Now',
                style: ButtonStyle.Link,
                url: 'https://forms.gle/GLV1hYqXK4iPd5Kz8',
                emoji: { name: '📋' }
              }
            }
          ]
        }
      ]
    })
  }
})

client.login(process.env.DISCORD_TOKEN)