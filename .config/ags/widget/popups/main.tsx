import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { Variable, GLib, bind, Binding } from 'astal';
import { getLayout } from '../../utils/get_layout';
import { SystemPopups } from './System';

export const Popups = (gdkMonitor: Gdk.Monitor) => {
  const monitorInt = App.get_monitors().indexOf(gdkMonitor);
  const layout = getLayout(monitorInt);

  return (
    <window gdkmonitor={gdkMonitor} anchor={layout.anchor}>
      <box>
        <SystemPopups monitorInt={monitorInt} />
      </box>
    </window>
  );
};
