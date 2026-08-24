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
      try {
        const { homepageService } = await import('../../../../services/supabaseService.js');
        const data = await homepageService.getHomepageContent();
        const aboutData = data.find(s => s.section === 'about')?.body;
        output = `NVIDIA Super Computing Club (NVIDIA-SC)
----------------------------------------
${aboutData?.body || 'Bridging academic computer science with high-performance industrial AI acceleration.'}`;
      } catch (err) {
        output = `Error fetching about details from database.`;
      }
      return { type: 'output', output };
    case 'events':
      output = await eventsHandler(args);
      return { type: 'output', output };
    case 'team':
      output = await teamHandler(args);
      return { type: 'output', output };
    case 'stats':
      try {
        const { dashboardService } = await import('../../../../services/supabaseService.js');
        const stats = await dashboardService.getStats();
        output = `NVIDIA-SC CLUB STATISTICS:
----------------------------------------
Active Student Members:   ${stats.team}
Events Hosted:            ${stats.events}
Pending Applications:     ${stats.applications}
Upcoming Events:          ${stats.upcoming}
Active Cluster Capacity:  100% (4x NVIDIA H200 PCIe nodes)`;
      } catch (err) {
        output = `Error fetching live statistics from database.`;
      }
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
