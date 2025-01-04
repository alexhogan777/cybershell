// Astal
import { exec, execAsync } from 'astal';

// Libraries
import Panel from '../state/panel/panel';
const panel = Panel.get_default();

// Functions

export function execAsyncClose(command: string, noBashC?: boolean) {
  let _command: string[] | string = ['bash', '-c', command];
  if (noBashC) _command = command;
  panel.togglePanel(panel.monitor, 'keybind');
  return execAsync(_command);
}

export function execClose(command: string, noBashC?: boolean) {
  let _command: string[] | string = ['bash', '-c', command];
  if (noBashC) _command = command;
  panel.togglePanel(panel.monitor, 'keybind');
  return exec(_command);
}
