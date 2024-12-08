import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { Variable, GLib, bind } from 'astal';
import { BarButton } from './BarButton';
import Notifd from 'gi://AstalNotifd';
import { getLayout } from '../../utils/get_layout';
import { dismissNotif } from '../panel/Notifications/Notification';
const notifd = Notifd.get_default();

function getIcon(notifs: Notifd.Notification[]) {
  if (notifs.length > 0) return 'notifications_unread';
  return 'notifications';
}

export const Notifications = ({ monitorInt }: { monitorInt: number }) => {
  return (
    <BarButton
      icon={bind(notifd, 'notifications').as(getIcon)}
      section='Notifications'
      tooltipText={bind(notifd, 'notifications').as(
        (notifs) => `${notifs.length} unread notifications`
      )}
      monitorInt={monitorInt}
      onClickRelease={(_: any, event: Astal.ClickEvent) => {
        if (event.button === Astal.MouseButton.MIDDLE)
          notifd.get_notifications().forEach((n) => dismissNotif(n));
      }}
    />
  );
};
