const { TemplateCommand } = require('../Structures');
const { Constants, Collection } = require('../Utility');
const { readdirSync } = require('fs');
const { resolve, join } = require('path');

class CommandManager {
  constructor(client) {
    this.client = client;
    this.prefixes = ['-'];
    this.commands = new Collection();
    this.templateCommand = TemplateCommand;
  };

  loadCommands() {
    const files = readdirSync(resolve('./Virium/Commands'));
    let fileStr = '';
    files.filter(fileName => fileName.endsWith('.js')).forEach(fileName => {
      let Command = require(join('../', 'Commands', fileName));
      this.loadCommand((new Command(this.client)));
      fileStr += `\n${fileName}`
    });
    this.client.managers.logManager.log({code: 2, message: `Loaded ${fileStr}`})
  }

  loadCommand(command) {
    return this.commands.set(command.name, command)
  }

  unloadCommand(command) {
    this.client.managers.logManager.log({code: 2, message: `Removed ${command.name} as a command`, options: {title: 'Command Manager', discord: true}});
    this.commands.delete(command.name)
  }

  reloadCommand(command) {
    this.client.managers.logManager.log({code: 2, message: `Reloaded ${command.name} as a command`, options: {title: 'Command Manager', discord: true}});
    let commandCopy = this.commands.delete(command.name);
    this.commands.set(commandCopy.name, commandCopy)
  }

  async attachMessageUtilities(message) {
    message.success = ({title = 'Success', content = 'Successful operation.', additionals = {color: Constants.COLORS.GREEN}}) => {
      let embed = {title: title, description: `**${content}**`};
      Object.keys(additionals).forEach(key => embed[key] = additionals[key]);
      return message.channel.send({embed, split: true})
    };
    message.error = ({title = 'Failure', content = 'Failed operation.', additionals = {color: Constants.COLORS.RED}}) => {
      let embed = {title: title, description: `**${content}**`};
      Object.keys(additionals).forEach(key => embed[key] = additionals[key]);
      return message.channel.send({embed, split: true})
    };
  }

  checkPrefix(message) {
    let prefix = this.prefixes.find(prefix => message.content.replace(/<@!/g, "<@").startsWith(prefix));
    if(prefix) {
      message.prefix = prefix;
      return prefix
    };
    return
  }

  async process(message) {
    if(!this.checkPrefix(message)) return false;
    let commandArguments = message.content.replace(/<@!/g, '<@').substring(message.prefix.length).split(' ');
    let commandName = commandArguments.shift();
    let command = this.commands.get(commandName);
    if(!command) return false;
    await this.attachMessageUtilities(message);
    return command.process(message, commandArguments);
  }
}

module.exports = CommandManager;
