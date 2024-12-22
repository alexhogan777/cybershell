// Astal
import { Astal, Gtk } from 'astal/gtk3';
import { Variable, bind, execAsync } from 'astal';

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
import { XButton } from '../../common/XButton';
import { MaterialIcon } from '../../common/MaterialIcon';
import { Subsection } from './main';

/*
Lock
Logout
Suspend
Hibernate
Shutdown
Restart
*/

export const showConfirm = Variable(false);
const onConfirm = Variable(['']);
function updateConfirm(execute: any) {
  onConfirm.set(execute);
}

const SessionButton = ({
  name,
  icon,
  execute,
  tooltipText,
  className,
}: {
  name: string;
  icon: string;
  execute: any;
  className: string;
  tooltipText?: string;
}) => {
  return (
    <XButton
      className={className}
      tooltipText={tooltipText}
      onClick={(self: Gtk.Button, event: Astal.ClickEvent) => {
        if (event.button === Astal.MouseButton.PRIMARY) {
          updateConfirm(execute);
          showConfirm.set(true);
        }
      }}
    >
      <box vertical spacing={spacing}>
        <MaterialIcon icon={icon} size={2} />
        <label label={name} />
      </box>
    </XButton>
  );
};

export const Session = () => {
  const ConfirmButton = () => {
    return (
      <XButton
        hexpand
        label='Confirm?'
        css='font-weight: bold;'
        onClick={(self: Gtk.Button, event: Astal.ClickEvent) => {
          if (event.button === Astal.MouseButton.PRIMARY) execAsync(onConfirm.get());
        }}
        className='corners-reversed'
      />
    );
  };
  const CancelButton = () => {
    return (
      <XButton
        onClick={(self: Gtk.Button, event: Astal.ClickEvent) => {
          if (event.button === Astal.MouseButton.PRIMARY) showConfirm.set(false);
        }}
      >
        <box vertical spacing={spacing} css='padding: 0em 1em 0em 1em;'>
          <MaterialIcon icon='arrow_back' size={2} />
          <label label='Cancel' />
        </box>
      </XButton>
    );
  };

  const ConfirmOptions = () => {
    return (
      <box
        name='confirm'
        spacing={spacing}
        setup={(self) => {
          function mapped() {}
          function unmapped() {
            showConfirm.set(false);
          }
          self.connect('map', mapped);
          self.connect('unmap', unmapped);
        }}
      >
        <ConfirmButton />
        <CancelButton />
      </box>
    );
  };

  return (
    <Subsection subsection='Session'>
      <stack
        valign={Gtk.Align.START}
        visibleChildName={bind(showConfirm).as((sc) => (sc ? 'confirm' : 'options'))}
        transitionType={Gtk.StackTransitionType.OVER_UP_DOWN}
      >
        <ConfirmOptions />
        <box name='options' spacing={spacing} homogeneous>
          <SessionButton
            name='Lock'
            icon='lock'
            tooltipText='Lock the screen without logging out.'
            execute={['bash', '-c', 'loginctl lock-session']}
            className='corners-reversed'
          />
          <SessionButton
            name='Logout'
            icon='logout'
            tooltipText='Close all apps and logout.'
            execute={['bash', '-c', 'killall Hyprland']}
            className='corners-top'
          />
          <SessionButton
            name='Suspend'
            icon='bedtime'
            tooltipText='Load application state into RAM and reach a low-power state.'
            execute={['bash', '-c', 'systemctl suspend']}
            className='corners-top'
          />
          <SessionButton
            name='Hibernate'
            icon='highlight_keyboard_focus'
            tooltipText='Load application state into ROM and reach a very low-power state.'
            execute={['bash', '-c', 'systemctl hibernate']}
            className='corners-top'
          />
          <SessionButton
            name='Reboot'
            icon='restart_alt'
            tooltipText='Close all apps and restart.'
            execute={['bash', '-c', 'systemctl reboot']}
            className='corners-top'
          />
          <SessionButton
            name='Shutdown'
            icon='power_settings_circle'
            tooltipText='Close all apps and shut down.'
            execute={['bash', '-c', 'systemctl poweroff']}
            className='corners-normal'
          />
        </box>
      </stack>
    </Subsection>
  );
};
