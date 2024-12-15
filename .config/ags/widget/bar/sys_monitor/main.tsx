// Astal
import { Gtk } from 'astal/gtk3';
import { userConfig } from '../../../config/user_config';

// Config
import Config from '../../../state/config/config';
const spacing = Config.get_default().appearance.paddingBase;

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
      spacing={spacing}
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
