import helpHandler from './help';
import { aboutHandler, whoamiHandler } from './about';
import eventsHandler from './events';
import teamHandler from './team';
import { sudoHandler, exitHandler, nvidiaSmiHandler, gpuHandler } from './fun';
import { lsHandler, cdHandler, catHandler, pwdHandler } from './navigation';

export const COMMANDS_LIST = [
  'help', 
  'clear', 
  'whoami', 
  'about', 
  'events', 
  'team', 
  'stats',
  'ls', 
  'cd', 
  'cat', 
  'pwd', 
  'nvidia-smi', 
  'gpu', 
  'hack', 
  'matrix', 
  'sudo', 
  'exit'
];

/**
 * Parses and executes a terminal command.
 * Returns an object: { type: 'string', output: 'string', newDir?: 'string' }
 */
export async function parseAndExecute(inputStr, currentDir) {
  const trimmed = inputStr.trim();
  if (trimmed === '') return null;

  // Split into command and arguments, ignoring excessive spaces
  const tokens = trimmed.split(/\s+/);
  const cmd = tokens[0].toLowerCase();
  const args = tokens.slice(1);

  // Shell direct actions
  if (cmd === 'clear') {
    return { type: 'clear', output: '' };
  }
  if (cmd === 'matrix') {
    return { type: 'matrix', output: 'ENTERING THE DIGITAL MATRIX ENVIRONMENT...' };
  }
  if (cmd === 'hack') {
    return { type: 'hack', output: 'BOOTING DIRECT SHELL BYPASS WORKSPACE...' };
  }

  let output = '';

  switch (cmd) {
    case 'help':
      output = helpHandler();
      return { type: 'output', output };
    case 'whoami':
      output = whoamiHandler();
      return { type: 'output', output };
    case 'about':
      output = aboutHandler();
      return { type: 'output', output };
    case 'events':
      output = await eventsHandler(args);
      return { type: 'output', output };
    case 'team':
      output = await teamHandler(args);
      return { type: 'output', output };
    case 'stats':
      output = `NVIDIA-SC CLUB STATISTICS:
----------------------------------------
Active Student Members:   150+
Events Hosted:            20+
Completed GPU Projects:   10+
Academic Partners:        5+
Active Cluster Capacity:  100% (4x NVIDIA H200 PCIe nodes)`;
      return { type: 'output', output };
    case 'sudo':
      output = sudoHandler();
      return { type: 'output', output };
    case 'exit':
      output = exitHandler();
      return { type: 'output', output };
    case 'nvidia-smi':
      output = nvidiaSmiHandler();
      return { type: 'output', output };
    case 'gpu':
      output = gpuHandler();
      return { type: 'output', output };
    case 'ls':
      output = lsHandler(currentDir);
      return { type: 'output', output };
    case 'cd':
      const cdRes = cdHandler(args, currentDir);
      return { type: 'cd', output: cdRes.output, newDir: cdRes.newDir };
    case 'cat':
      output = catHandler(args, currentDir);
      return { type: 'output', output };
    case 'pwd':
      output = pwdHandler(currentDir);
      return { type: 'output', output };
    default:
      output = `bash: ${cmd}: command not found. Type "help" for a list of commands.`;
      return { type: 'output', output };
  }
}
