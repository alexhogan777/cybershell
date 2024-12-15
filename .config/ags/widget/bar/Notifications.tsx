// Astal
import { Astal } from 'astal/gtk3';
import { bind } from 'astal';

// Libraries
import Notifd from 'gi://AstalNotifd';
const notifd = Notifd.get_default();

// Functions
import { dismissNotif } from '../panel/Notifications/Notification';

// Widgets
import { BarButton } from './BarButton';

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
