class ErrorManager {
  constructor(client) {
    this.client = client;
    this.errorBucket = [];
    process.on('uncaughtException', this.handleException.bind(this))
  };

  handleException(error) {
    console.log(this.errorBucket);
    this.errorBucket.push(error.stack);
    const sameErrors = this.errorBucket.filter(stack => stack == error.stack);
    if(sameErrors >= 3) {
      this.client.managers.logManager.log({code: 0, message: error.stack, options: {fatal: true, discord: true}});
      return process.exit()
    };
    this.client.managers.logManager.log({code: 0, message: error.stack, options: {errorTitle: error.name, discord: true}});
  }
}

module.exports = ErrorManager;
