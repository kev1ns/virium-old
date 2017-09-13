const { TemplateCommand } = require('../Structures');

class HelpCommand extends TemplateCommand {
  constructor(client) {
    super(client);
    this.name = 'help';
    this.description = 'Provides list of commands and other information.';
    this.developer = false;
  }

  execute(message, args) {
    let commandString = 'Current commands: \n';
    this.client.managers.commandManager.commands.filter(command => !command.developer).forEach(command => {
      commandString += `\n${command.name} - ${command.description}`;
    });
    commandsString += `\n\n**Discord:** ${this.client.settings.discordGuild}\n**Developer:** kev#2881`;
    let embed = {
      title: 'Virium Help',
      description: 'This will show accessible commands and other information.',
      fields: [{name: 'Commands', value: commandString}]
    };
    message.success({content: 'Check your direct messages!'});
    return message.author.send({embed})
  }
}

module.exports = HelpCommand
