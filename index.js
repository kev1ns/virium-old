const { readFileSync } = require('fs');
const ViriumFramework = require('./Virium');
const Configuration = readFileSync('./resources/configuration.json');
const virium = new ViriumFramework(Configuration);

virium.initiate();
