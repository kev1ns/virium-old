class Command {
  constructor(client) {
    this.client = client;
    this.name = 'undocumented command';
    this.description = 'undocumented command';
    this.aliases = [];
    this.developer = true;
    this.nsfw = false;
    this.argumentsRequired = false;
  }

  reload() {
    this.client.managers.commandManager.reloadCommand(this)
  }

  log(data) {
    return this.client.managers.logManager.log({code: 3, message: data, options: {title: `${this.name}Command`}})
  }

  permissionCheck(message) {
    let passed = true;
    switch(true) {
      case this.developer: {
        if(message.author.id !== '84388454456127488') passed = false;
        break;
      }
      case this.nsfw: {
        if(!message.channel.nsfw || !message.channel.name.startsWith('nsfw')) passed = false;
        break;
      }
    };
    return passed
  }

  async process(message, commandArguments) {
    if(!this.permissionCheck(message)) return message.channel.send('No permissions');
    let executionResponse = await this.execute(message, commandArguments);
    return executionResponse
  }

  execute(message, args) {
    return 'default command'
  }
};

module.exports = Command;
