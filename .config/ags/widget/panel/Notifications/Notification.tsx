// Astal
import { Gtk } from 'astal/gtk3';
import { Variable, bind, timeout } from 'astal';

// Libraries
import Notifd from 'gi://AstalNotifd';
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
import { playSound } from '../../../utils/play_sound';
import {
  FriendlyAction,
  getFriendlyNotifActions,
  getFriendlyNotifAppIcon,
  getFriendlyNotifBody,
  getFriendlyNotifBodyRetracted,
  getFriendlyNotifTime,
  getFriendlyNotifTitle,
} from '../../../utils/friendly';
import { executeCCR } from '../../common/click_close_region';

// Widgets
import { MaterialIcon } from '../../common/MaterialIcon';
import { XButton } from '../../common/XButton';

export function dismissNotif(notif: Notifd.Notification) {
  notif.emit('resolved', Notifd.ClosedReason.DISMISSED_BY_USER);
  timeout(125, () => notif.dismiss());
}

export const Notification = (notif: Notifd.Notification) => {
  const expanded = Variable(false);
  const className = Variable('');
  const AppIcon = () => {
    return (
      <icon icon={getFriendlyNotifAppIcon(notif)} file={getFriendlyNotifAppIcon(notif)} />
      // <box
      //   css={`
      //     background-image: url('${getFriendlyNotifAppIcon(notif)}');
      //     min-width: 1.5em;
      //     min-height: 1.5em;
      //     background-size: cover;
      //     background-position: center;
      //     background-repeat: no-repeat;
      //   `}
      //   halign={Gtk.Align.END}
      //   valign={Gtk.Align.CENTER}
      // />
    );
  };
  const Title = (title: string) => {
    return (
      <label className='notification-title' label={getFriendlyNotifTitle(title)} xalign={0} wrap />
    );
  };
  const Time = (time: number) => {
    return (
      // @ts-expect-error
      <label className='notification-time' label={getFriendlyNotifTime(time)} />
    );
  };

  const DropdownButton = () => {
    return (
      <XButton
        className='notification-action-title'
        valign={Gtk.Align.CENTER}
        iconObj={{
          icon: bind(expanded).as((e) => (e ? 'arrow_drop_down' : 'arrow_drop_up')),
        }}
        onClick={() => {
          expanded.set(!expanded.get());
        }}
      />
    );
  };

  const Dismiss = () => {
    return (
      <XButton
        iconObj={{ icon: 'close' }}
        valign={Gtk.Align.CENTER}
        className='notification-action-title'
        onClick={() => dismissNotif(notif)}
      />
    );
  };
  const Body = (body: string) => {
    return (
      <label className='notification-body' label={body} xalign={0} valign={Gtk.Align.START} wrap />
    );
  };
  const Image = (image: string) => {
    return (
      <box
        css={`
          background-image: url('${image}');
          min-width: 5em;
          min-height: 5em;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          border-radius: 50%;
        `}
        halign={Gtk.Align.END}
        valign={Gtk.Align.CENTER}
      />
    );
  };
  const Actions = (actions: Notifd.Action[]) => {
    const friendlyActions = getFriendlyNotifActions(actions);
    const Action = (action: FriendlyAction) => {
      function getCorners() {
        switch (friendlyActions.indexOf(action)) {
          case 0:
            return 'corners-reversed';
          case friendlyActions.length - 1:
            return 'corners-normal';
          default:
            return 'corners-top';
        }
      }
      return (
        <XButton
          className={`notification-action ${getCorners()}`}
          hexpand
          onClick={() => {
            notif.invoke(action.action.id);
            executeCCR();
          }}
        >
          {action.icon && <MaterialIcon icon={action.icon} />}
          <label label={action.name} />
        </XButton>
      );
    };

    return (
      <box className='notification-actions' spacing={spacing.as((v) => v * 2)}>
        {friendlyActions.map(Action)}
      </box>
    );
  };

  const BodyRetracted = (body: string) => {
    return (
      <eventbox
        name='retracted'
        cursor='pointer'
        onHover={() => {
          className.set('hover');
        }}
        onHoverLost={() => {
          className.set('');
        }}
        onClick={() => {
          playSound('button');
          expanded.set(!expanded.get());
        }}
      >
        <label
          className='notification-body'
          label={body}
          xalign={0}
          valign={Gtk.Align.START}
          truncate
        />
      </eventbox>
    );
  };

  return (
    <revealer
      name={`${notif.id}`}
      transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
      transitionDuration={125}
      revealChild={false}
      setup={(self) => {
        function mapped() {
          timeout(10, () => (self.revealChild = true));
        }
        function unmapped() {
          expanded.set(false);
          self.revealChild = false;
        }
        self.connect('map', mapped);
        self.connect('unmap', unmapped);
        self.hook(notif, 'resolved', () => {
          self.revealChild = false;
        });
      }}
    >
      <box
        className={bind(className).as((v) => `notification corners-reversed ${v}`)}
        vertical
        spacing={spacing}
      >
        <box name='title-bar' spacing={spacing}>
          <AppIcon />
          {Title(notif.summary)}
          <box hexpand />
          <DropdownButton />
          {Time(notif.time)}
          <Dismiss />
        </box>
        <box className='notification-content'>
          <stack
            interpolateSize
            vhomogeneous={false}
            transitionType={Gtk.StackTransitionType.UNDER_DOWN}
            visibleChildName={'retracted'}
            setup={(self) => {
              expanded.subscribe((e) => {
                if (e) {
                  self.visibleChildName = 'expanded';
                  panel.section;
                } else {
                  self.visibleChildName = 'retracted';
                }
              });
              bind(panel, 'section').as((s) => {
                if (s !== 'Notifications') expanded.set(false);
              });
            }}
          >
            <box name='expanded' vertical spacing={spacing}>
              <eventbox
                cursor='pointer'
                onHover={() => {
                  className.set('hover');
                }}
                onHoverLost={() => {
                  className.set('');
                }}
                onClick={() => {
                  playSound('button');
                  notif.invoke('default');
                  executeCCR();
                }}
              >
                <box spacing={spacing}>
                  {Body(getFriendlyNotifBody(notif.body))}
                  <box hexpand />
                  {Image(notif.image)}
                </box>
              </eventbox>
              {Actions(notif.get_actions())}
            </box>
            {BodyRetracted(getFriendlyNotifBodyRetracted(notif.body))}
          </stack>
        </box>
      </box>
    </revealer>
  );
};
