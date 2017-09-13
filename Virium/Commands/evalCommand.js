const { TemplateCommand } = require('../Structures');
const { inspect } = require('util');
class EvalCommand extends TemplateCommand {
  constructor(client) {
    super(client);
    this.name = 'eval';
    this.description = 'Evalute JS';
  }

  preprocess(input) {
    const awaitMatcher = /^(?:\s*(?:(?:let|var|const)\s)?\s*([^=]+)=\s*|^\s*)(await\s[\s\S]*)/;
    const asyncWrapper = (code, binder) => {
      let assign = binder ? `global.${binder} = ` : '';
      return `(function(){ async function _wrap() { return ${assign}${code} } return _wrap();})()`;
    };
    const match = input.match(awaitMatcher);
    if (match) {
      input = `${asyncWrapper(match[2], match[1])}`;
    }
    return input;
  }

  execute(message, args) {
    let evaluationResponse;
    try {
      evaluationResponse = eval(this.preprocess(args.join(' ')));
      if(typeof evaluationResponse === 'object') evaluationResponse = inspect(evaluationResponse);
      evaluationResponse = String(evaluationResponse).replace(/this.client.token/g, '[token]')
      return message.success({title: 'Evaluation Result', content: `\`\`\`${evaluationResponse}\`\`\``})
    } catch(error) {
      return message.error({title: 'Evaluation Error', content: `\`\`\`js\n${error.name}: ${error.message}\`\`\``})
    }
  }
}

module.exports = EvalCommand;
