export default function helpHandler() {
  return `AVAILABLE COMMANDS:
  help               Lists all available commands with descriptions
  clear              Clears the terminal screen
  whoami             Returns info about the NVIDIA Super Computing Club
  about              Club description, mission, when founded
  events             Lists upcoming events (date, title, location)
  events --featured  Lists only featured events
  team               Lists team members (name, role)
  team <name>        Shows details for a specific member
  stats              Shows club statistics (members, events, projects)

NAVIGATION:
  ls                 Lists current "directories": events/ team/ projects/ about/
  cd <dir>           Changes directory context (e.g., cd about, cd ..)
  cat <file>         Shows fake file content (e.g., cat README.md)
  pwd                Prints working directory path

SYSTEM / EASTER EGGS:
  nvidia-smi         Fake nvidia-smi output table
  gpu                Shows animated GPU utilization progress bar
  hack               Runs interactive hacker screen compilation logs
  matrix             Triggers full screen green code digital rain (3s)
  sudo               Nice try. Run it to see what happens.
  exit               Try exiting the matrix.
`;
}
