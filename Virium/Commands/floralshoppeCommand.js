const { TemplateCommand } = require('../Structures');

class FloralShoppeCommand extends TemplateCommand {
  constructor(client) {
    super(client);
    this.name = 'floralshoppe';
    this.developer = false;
  }

  async execute(message, args) {
    let voiceChannel = message.member.voiceChannel;
    if(!voiceChannel) return message.error({content: 'You must join a voice channel to use this command.'});
    if(this.client.voiceConnections.size >= 2) this.client.voiceConnections.forEach(voice => voice.leave());
    let connection = await voiceChannel.join();
    connection.playFile('../../resources/floralshoppe.mp3');
  }
}

module.exports = FloralShoppeCommand;
