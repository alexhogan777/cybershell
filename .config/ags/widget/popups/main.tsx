// Astal
import { App, Gdk } from 'astal/gtk3';

// Functions
import { getLayout } from '../../utils/get_layout';

// Widgets
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
