const { TemplateCommand } = require('../Structures');

class PingCommand extends TemplateCommand {
  constructor(client) {
    super(client);
    this.name = 'ping';
    this.description = 'Returns the response time between the bot and discord.';
    this.developer = false;
  }

  execute(message, args) {
    return message.success({title: 'Response Time', content: `${Math.floor(this.client.ping)}ms`})
  }
}

module.exports = PingCommand
