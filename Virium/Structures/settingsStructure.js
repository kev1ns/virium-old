class Settings {
  constructor(configuration) {
    this.configuration = JSON.parse(configuration);
    this.init()
  }

  setProperty(prop, value) {
    this[prop] = value;
  }

  getProperty(prop) {
    return this[prop];
  }

  init() {
    Object.keys(this.configuration).forEach(key => {
      this.setProperty(key, this.configuration[key])
    });
    delete this.configuration
  }
};

module.exports = Settings;
