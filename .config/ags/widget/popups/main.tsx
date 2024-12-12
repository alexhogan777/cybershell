import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { Variable, GLib, bind, Binding } from 'astal';
import { getLayout } from '../../utils/get_layout';
import { SystemPopups } from './System';
import { NotificationPopups } from './Notifications';

export const Popups = (gdkMonitor: Gdk.Monitor) => {
  const monitorInt = App.get_monitors().indexOf(gdkMonitor);
  const layout = getLayout(monitorInt);

  return (
    <window
      name={`Popups-${monitorInt}`}
      gdkmonitor={gdkMonitor}
      anchor={layout.anchor}
    >
      <box>
        {/* <SystemPopups monitorInt={monitorInt} /> */}
        {NotificationPopups(monitorInt)}
      </box>
    </window>
  );
};
