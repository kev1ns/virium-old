const { Constants } = require('../Utility');
const Chalk = require('chalk');
const NodeUtil = require('util');
class LogManager {
  constructor(client) {
    this.client = client;
    this.webhook = new client.library.WebhookClient(
      client.settings.getProperty('webhookId'),
      client.settings.getProperty('webhookToken')
    );
  }

  discordLog(title = 'Log', message = '', options = {username: 'Log Manager', color: Constants.COLORS.WHITE}) {
    let richEmbed = {
      title: title,
      description: message,
      timestamp: new Date()
    }; Object.keys(options).forEach(key => richEmbed[key] = options[key]);
    this.webhook.send('', {
      username: 'Log Manager',
      avatarURL: this.client.settings.getProperty('webhookAvatar'),
      split: true,
      embeds: [richEmbed]
    })
  }

  log({message = 'No message provided.', code = 0, options = {title: 'Log Manager', errorTitle: 'Generic'}}) {
    let endMessage = Chalk.cyan.bold(`\n<${'-'.repeat(30)}>\n`);
    if(typeof message === 'object') message = NodeUtil.inspect(message);

    switch(code) {
      case Constants.LOG_CODES.READY_EVENT: {
        if(options.discord) {
          let fieldData = ['guilds', 'users', 'channels'];
          let fields = [];
          fieldData.forEach(key => fields.push({name: key, value: this.client[key].size}));
          this.discordLog('Ready Event', 'Client fired the ready event, successfully connected to the gateway.', {
            color: Constants.COLORS.GREEN,
            fields: fields
          })
        };
        let statistics = `\t${Chalk.white('Debug Mode: ')}${Chalk.green(this.client.settings.debug)}
        ${Chalk.white('Client User: ')}${Chalk.green(`${this.client.user.username}#${this.client.user.discriminator}`)}
        ${Chalk.white('Guilds: ')}${Chalk.green(this.client.guilds.size)}
        ${Chalk.white('Channels: ')}${Chalk.green(this.client.channels.size)}
        ${Chalk.white('Users: ')}${Chalk.green(this.client.users.size)}`;
        message = `${endMessage}${Chalk.yellow.bold('[CLIENT/EVENTS/READY]: ')}\n${statistics}${endMessage}`
        console.log(message);
        break;
      }

      case Constants.LOG_CODES.DEBUG: {
        message = `${endMessage}${Chalk.yellow.bold('[CLIENT/DEBUG]: ')}\n\n${message}${endMessage}`;
        console.log(message);
        break;
      };

      case Constants.LOG_CODES.GENERIC: {
        if(options.discord) {
          this.discordLog(options.title, `**${message}**`, {
            color: Constants.COLORS.BLURPLE,
          })
        };
        message = `${endMessage}${Chalk.yellow.bold(`[CLIENT/${options.title}]: `)}\n\n${message}${endMessage}`;
        console.log(message);
        break;
      };

      case Constants.LOG_CODES.COMMAND: {
        if(options.discord) {
          this.discordLog(options.title, `**${message}**`, {
            color: Constants.COLORS.BLURPLE,
          })
        };
        message = `${endMessage}${Chalk.yellow.bold(`[CLIENT/COMMAND/${options.title}]: `)}\n\n${message}${endMessage}`;
        console.log(message);
        break;
      };

      case Constants.LOG_CODES.ERROR: {
        if(options.discord && options.fatal) {
          this.discordLog('Error Manager - Fatal', 'The following fatal error caused the process to exit:\n```${message}```\n@everyone', {
            color: Constants.COLORS.RED,
          })
        } else if(options.discord) {
          this.discordLog(`Error Manager - ${options.errorTitle}`, `The following error occured:\n\`\`\`${message}\`\`\`\n@everyone`, {
            color: Constants.COLORS.RED,
          })
        };
        message = `${endMessage}${Chalk.yellow.bold(`[CLIENT/${Chalk.red.bold('ERROR')}/${options.errorTitle}]: `)}\n\n${Chalk.bgRed(message)}${endMessage}`;
        console.log(message);
        break;
      };

      default: console.log(`${endMessage}${Chalk.yellow.bold('[CLIENT/LOGGER]: ')}\n\n${Chalk.cyan.bold('this is a test (log was called with no code or failed)')}${endMessage}`);
    }
  }
}

module.exports = LogManager;
