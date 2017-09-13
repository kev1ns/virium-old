const { Constants } = require('../Utility');

class EventManager {
  constructor(client) {
    this.client = client;
    client.on('ready', this.clientReady.bind(this));
    client.on('message', this.handleMessage.bind(this));
    client.on('error', this.handleError.bind(this));
  }

  clientReady() {
    this.client.managers.logManager.log({code: 1, options: {discord: true}});
  }

  handleError(error) {
    this.client.managers.logManager.log({code: 0, message: error})
  }

  async handleMessage(message) {
    let command;
    try {
      command = await this.client.managers.commandManager.process(message);
    } catch(error) {
      this.client.managers.logManager.log({code: 0, message: error})
    };

    if(!command) return;
  }
};

module.exports = EventManager;
