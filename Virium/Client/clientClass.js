const dJS = require('discord.js');
const { Settings } = require('../Structures');
const { EventManager, ErrorManager, LogManager, CommandManager } = require('../Managers');

class Virium extends dJS.Client {
  constructor(string) {
    if(!string) throw new Error('A string wasn\'t provided');
    super();
    this.settings = new Settings(string);
    this.library = dJS;
    this.managers = {
      logManager: new LogManager(this),
      eventManager: new EventManager(this),
      commandManager: new CommandManager(this),
      errorManager: new ErrorManager(this)
    };
  }

  initiate() {
    this.managers.commandManager.loadCommands();
    this.login(this.settings.getProperty('token'));
  }
}

module.exports = Virium;
