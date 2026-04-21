const { Client, GatewayIntentBits, ComponentType, ButtonStyle, MessageFlags } = require('discord.js')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
})

client.once('clientReady', () => {
  console.log(`Logged in as ${client.user.tag}`)
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return

  const roleMap = {
    role_tag: '1495624606730682428',
    role_pings: '1495670066203590796'
  }

  const roleId = roleMap[interaction.customId]
  if (!roleId) return

  const member = interaction.member
  const role = interaction.guild.roles.cache.get(roleId)

  if (!role) {
    return interaction.reply({ content: 'Role not found.', ephemeral: true })
  }

  if (member.roles.cache.has(roleId)) {
    await member.roles.remove(role)
    await interaction.reply({ content: `Removed <@&${roleId}>.`, ephemeral: true })
  } else {
    await member.roles.add(role)
    await interaction.reply({ content: `Added <@&${roleId}>!`, ephemeral: true })
  }
})

client.on('messageCreate', async message => {
  if (message.author.bot) return

  if (message.content === '!sendembed') {
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
                  content: '## <:windowslogo:1495437600364826724> Steam / PC'
                },
                {
                  type: ComponentType.TextDisplay,
                  content: 'Extract the downloaded zip file and run \n`VR.bat`, or\n`SCREENMODE.bat` Either one works!'
                }
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
                {
                  type: ComponentType.TextDisplay,
                  content: '## <:androidlogo:1495438460297941002> META'
                },
                {
                  type: ComponentType.TextDisplay,
                  content: 'Go to the download link and join the org, once done, intall the game in your headset.'
                }
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
                {
                  type: ComponentType.TextDisplay,
                  content: '## <:applelogo:1495438113034469417> iOS'
                },
                {
                  type: ComponentType.TextDisplay,
                  content: 'No current build for iOS yet.'
                }
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
    await message.channel.send({
      flags: MessageFlags.IsComponentsV2,
      components: [
        {
          type: ComponentType.Container,
          components: [
            {
              type: ComponentType.TextDisplay,
              content: '# Credits & Contributors'
            },
            {
              type: ComponentType.Separator
            },
            {
              type: ComponentType.TextDisplay,
              content: '### 👑 Owner\n<@370951912696053760>'
            },
            {
              type: ComponentType.Separator
            },
            {
              type: ComponentType.TextDisplay,
              content: '### 🔨 Builders & Contributors'
            },
            {
              type: ComponentType.TextDisplay,
              content: '<@1290397084154859564> — Helped/Basically Made The Servers And Game Logic Possible'
            },
            {
              type: ComponentType.TextDisplay,
              content: '<@810165054019600387> — Brought Back Rec Room Legacy After It Was Canceled'
            },
            {
              type: ComponentType.TextDisplay,
              content: '<@370951912696053760> — Had The Original Idea, Tried To Make It Possible As Basically One Dev'
            },
            {
              type: ComponentType.TextDisplay,
              content: '<@597393930438311937> — Original Helper Dev, Worked On The OG Logic Before It Was Canceled But Is Now Back'
            },
            {
              type: ComponentType.Separator
            },
            {
              type: ComponentType.TextDisplay,
              content: '### 🛡️ Staff & Helpers\n*They are making RRL a great place, better than the hells of Radium. Oh God.*'
            },
            {
              type: ComponentType.TextDisplay,
              content: '<@1012815068318142494> , <@1376641597025812480> , <@857414684977659904> , <@1426341585120919594> , <@1311176045407375362>'
            },
            {
              type: ComponentType.TextDisplay,
              content: '*I can\'t forget everyone apart of these teams.*\n<@&1491683819923701790> & <@&1491683896776196296>'
            },
            {
              type: ComponentType.Separator
            },
            {
              type: ComponentType.TextDisplay,
              content: '*"I just decided to make this to make sure everyone gets known properly considering the work they\'ve done to shape RRL to its best it\'s ever been."*\n— Kinetic'
            }
          ]
        }
      ]
    })
  }

  if (message.content === '!roleing') {
    await message.channel.send({
      flags: MessageFlags.IsComponentsV2,
      components: [
        {
          type: ComponentType.Container,
          components: [
            {
              type: ComponentType.TextDisplay,
              content: '# 🎭 Self Roles'
            },
            {
              type: ComponentType.Separator
            },
            {
              type: ComponentType.Section,
              components: [
                {
                  type: ComponentType.TextDisplay,
                  content: '### <@&1495624606730682428>\nUse the server tag if you choose to have this role.'
                }
              ],
              accessory: {
                type: ComponentType.Button,
                label: 'Get Role',
                style: ButtonStyle.Success,
                custom_id: 'role_tag'
              }
            },
            {
              type: ComponentType.Separator
            },
            {
              type: ComponentType.Section,
              components: [
                {
                  type: ComponentType.TextDisplay,
                  content: '### <@&1495670066203590796>\nGet pinged when something is posted in <#1491702133790343218>.'
                }
              ],
              accessory: {
                type: ComponentType.Button,
                label: 'Get Role',
                style: ButtonStyle.Primary,
                custom_id: 'role_pings'
              }
            }
          ]
        }
      ]
    })
  }
})

require('dotenv').config()
client.login(process.env.DISCORD_TOKEN)