import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { Variable, GLib, bind, Binding } from 'astal';
import { expandedSection, togglePanel } from './main';
import { userConfig } from '../../config/user_config';
import { MaterialIcon } from '../common/MaterialIcon';
import { playSound } from '../../utils/play_sound';

interface PanelSection {
  monitorInt: number;
  section: string;
  title: Gtk.Widget;
  icon: string;
  children?: Gtk.Widget[];
  child?: Gtk.Widget;
}

export const PanelSection = ({
  monitorInt,
  section,
  title,
  icon,
  child,
}: PanelSection) => {
  const className = Variable<string>('');
  const Bar = () => {
    return (
      <eventbox
        cursor='pointer'
        onHover={() => {
          playSound('hover');
          className.set('hover');
        }}
        onHoverLost={() => className.set('')}
        onClick={(self, event) => {
          if ((event.button = Astal.MouseButton.PRIMARY)) {
            playSound('button');
            className.set('active');
            if (expandedSection.get() === section) {
              togglePanel(monitorInt, 'Notifications');
            } else {
              togglePanel(monitorInt, section);
            }
          }
        }}
        onClickRelease={() => className.set('')}
      >
        <box
          className='title-bar'
          spacing={userConfig.appearance.spacing}
          valign={Gtk.Align.CENTER}
        >
          <MaterialIcon icon={icon} size={1.25} />
          <box hexpand>{title}</box>
          <MaterialIcon
            icon={bind(expandedSection).as((es) =>
              es === section ? 'arrow_drop_down' : 'arrow_drop_up'
            )}
            size={1}
          />
        </box>
      </eventbox>
    );
  };

  const Content = () => {
    return (
      <revealer
        transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
        revealChild={bind(expandedSection).as((v) => v === section)}
      >
        {child}
      </revealer>
    );
  };

  return (
    <box
      vertical
      spacing={userConfig.appearance.spacing}
      className={bind(className).as((v) => `panel-section ${v}`)}
    >
      <Bar />
      <Content />
    </box>
  );
};
