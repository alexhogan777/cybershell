// Astal
import { Gtk } from 'astal/gtk3';
import { userConfig } from '../../../config/user_config';

// Widgets
import { Audio } from './Audio';
import { BatteryMonitor } from './Battery';
import { BluetoothMonitor } from './Bluetooth';
import { NetworkMonitor } from './Network';
import { Resources } from './Resources';

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
