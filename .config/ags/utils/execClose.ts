// Astal
import { exec, execAsync } from 'astal';

// Functions
import { executeCCR } from '../widget/common/click_close_region';

export function execAsyncClose(command: string, noBashC?: boolean) {
  let _command: string[] | string = ['bash', '-c', command];
  if (noBashC) _command = command;
  executeCCR();
  return execAsync(_command);
}

export function execClose(command: string, noBashC?: boolean) {
  let _command: string[] | string = ['bash', '-c', command];
  if (noBashC) _command = command;
  executeCCR();
  return exec(_command);
}
