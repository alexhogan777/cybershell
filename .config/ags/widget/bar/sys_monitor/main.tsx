import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { Variable, GLib, bind, execAsync, exec } from 'astal';
import { userConfig } from '../../../config/user_config';

import { Resources } from './Resources';
import { Audio } from './Audio';
import { NetworkMonitor } from './Network';
import { BluetoothMonitor } from './Bluetooth';
import { BatteryMonitor } from './Battery';
import { getLayout } from '../../../utils/get_layout';

export const SysMonitor = ({ monitorInt }: { monitorInt: number }) => {
  return (
    <box
      vertical
      className={`Sys-Monitor`}
      spacing={userConfig.appearance.spacing}
      halign={Gtk.Align.CENTER}
      valign={Gtk.Align.END}
    >
      <Audio />
      <BluetoothMonitor />
      <NetworkMonitor />
      <BatteryMonitor />
      {/* <Resources /> */}
    </box>
  );
};
