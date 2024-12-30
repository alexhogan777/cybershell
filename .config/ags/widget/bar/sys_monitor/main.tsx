// Astal
import { bind, Binding, Variable } from 'astal';
import { Gtk } from 'astal/gtk3';

// Config
import Config from '../../../state/config/config';
const config = Config.get_default();
const spacing = bind(
  Variable(config.appearance.paddingBase).observe(
    config.appearance,
    'updated',
    () => config.appearance.paddingBase
  )
);

// Widgets
import { Audio } from './Audio';
import { BatteryMonitor } from './Battery';
import { BluetoothMonitor } from './Bluetooth';
import { NetworkMonitor } from './Network';
import { Resources } from './Resources';
import { getLayout } from '../../../utils/get_layout';

export const SysMonitor = ({ vertical }: { vertical: Binding<boolean> }) => {
  return (
    <box
      vertical={vertical}
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
