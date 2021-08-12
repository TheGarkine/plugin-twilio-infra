const { TwilioClientCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const { flags } = require("@oclif/command");

const { destroyInfra } = require('../../infra');
const { runPulumiCommand, Printer } = require('../../utils');

class InfraDestroy extends TwilioClientCommand {
  async run() {
    await super.run();
    let command = ['destroy'];
    if (this.flags.yes) {
      command.push("--yes");
    }
    await runPulumiCommand(command, true, this.twilioClient);
    try {
      destroyInfra(this.twilioClient.accountSid);
      Printer.printSuccess('Resource(s) destroyed successfully!');
    } catch (error) {
      throw new TwilioCliError('Error running destroy: ' + error.message);
    }
  }
}

InfraDestroy.flags = Object.assign(
  {
    yes: flags.boolean({
      char: 'y',
      description: 'Passes through the --yes option to pulumi. Destroys without interactive confirmation.'
    })
  },
  TwilioClientCommand.flags
);

InfraDestroy.description =
  'Destroy deployed resources';

module.exports = InfraDestroy;
