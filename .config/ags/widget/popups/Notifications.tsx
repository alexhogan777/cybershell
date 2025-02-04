// Astal
import { Gtk } from 'astal/gtk3';
import { Variable, bind, timeout } from 'astal';

// Libraries
import Notifd from 'gi://AstalNotifd';
import Hyprland from 'gi://AstalHyprland';
const notifd = Notifd.get_default();

// Config
import { userConfig } from '../../config/user_config';

// Functions
import { getLayout } from '../../utils/get_layout';

export const NotificationPopups = (monitorInt: number) => {
  const layout = getLayout(monitorInt);

  const NotificationPopup = (notif: Notifd.Notification) => {
    const isPopup = Variable(
      notif.get_time() >=
        Math.floor(
          (Date.now() - userConfig.notifications.popups.duration) / 1000
        )
    );
    return (
      <revealer
        transitionType={
          layout.side === 'left'
            ? Gtk.RevealerTransitionType.SLIDE_RIGHT
            : Gtk.RevealerTransitionType.SLIDE_LEFT
        }
        onRealize={(self) => {
          if (!isPopup.get()) self.visible = false;
          timeout(userConfig.notifications.popups.duration, () =>
            isPopup.set(false)
          );
        }}
        revealChild={bind(isPopup).as((v) => {
          if (!userConfig.notifications.popups.enabled) return false;
          const activeMonitor = Hyprland.get_default().get_focused_monitor().id;

          switch (userConfig.notifications.popups.showOn) {
            case 'active':
              if (monitorInt !== activeMonitor) return false;
              break;
            case 'all':
              break;
            case 'bar':
              if (!layout.rendered) return false;
              break;
            default:
              //@ts-expect-error
              if (!userConfig.notifications.popups.showOn.includes(monitorInt))
                return false;
              break;
          }
          return v;
        })}
      >
        <box />
      </revealer>
    );
  };

  return (
    <box vertical>
      {bind(notifd, 'notifications').as((ns) => ns.map(NotificationPopup))}
    </box>
  );
};
