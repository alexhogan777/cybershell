// Astal
import { Gtk } from 'astal/gtk3';
import { bind, Variable } from 'astal';

// Libraries
import Notifd from 'gi://AstalNotifd';
const notifd = Notifd.get_default();
import PanelLib from '../../../state/panel/panel';
const panel = PanelLib.get_default();

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

// Functions
import { dismissNotif } from './Notification';

// Widgets
import { MaterialIcon } from '../../common/MaterialIcon';
import { Notification } from './Notification';
import { XButton } from '../../common/XButton';

export const Notifications = (monitorInt: number) => {
  const Bar = () => {
    const Icon = () => {
      return <MaterialIcon icon='notifications' size={1.25} />;
    };
    const Title = () => {
      return <label label='Notifications' className='title' valign={Gtk.Align.CENTER} />;
    };
    const ClearAll = () => {
      return (
        <revealer
          transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
          revealChild={bind(notifd, 'notifications').as((v) => v.length > 0)}
        >
          <XButton
            label='Clear'
            onClick={() => notifd.get_notifications().forEach((n) => dismissNotif(n))}
          />
        </revealer>
      );
    };
    const NotificationsActions = () => {
      return (
        <revealer
          transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
          revealChild={bind(panel, 'section').as((v) => v === 'Notifications')}
        >
          <box className='section-actions'>
            <ClearAll />
          </box>
        </revealer>
      );
    };
    return (
      <box spacing={spacing} className='title-bar' valign={Gtk.Align.CENTER}>
        <Icon />
        <Title />
        <box hexpand />
        <NotificationsActions />
      </box>
    );
  };

  return (
    <eventbox
      onClick={() => {
        panel.section !== 'Notifications' && panel.togglePanel(monitorInt, 'Notifications');
      }}
    >
      <box vertical spacing={spacing} className='panel-section notifications'>
        <Bar />
        <scrollable hscroll={Gtk.PolicyType.NEVER} vscroll={Gtk.PolicyType.ALWAYS} vexpand>
          <box vertical spacing={spacing}>
            {bind(notifd, 'notifications').as((notifs) => notifs.map(Notification))}
          </box>
        </scrollable>
      </box>
    </eventbox>
  );
};
