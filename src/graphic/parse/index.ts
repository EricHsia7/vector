import { d } from '../attributes/index';

export function parsePathCommands(commands: string): d {
  const commands: d = [];
  const regex = /([A-Z])(?:\s+([^A-Z]+))?/g;
  let match;

  while ((match = regex.exec(input)) !== null) {
    const type = match[1];
    const params = match[2]
      ? match[2].split(/[\s,]+/) // Split parameters by spaces or commas
      : []; // No parameters
    switch (type) {
      case 'A':
        commands.push({ type: 'A' });
        break;

      case 'C':
        break;

      case 'H':
        break;

      case 'V':
        break;

      case 'L':
        break;

      case 'M':
        break;

      case 'Q':
        break;

      case 'S':
        break;

      case 'T':
        break;

      case 'Z':
        break;

      default:
        break;
    }

    commands.push({ type: type });
  }

  return commands;
}
