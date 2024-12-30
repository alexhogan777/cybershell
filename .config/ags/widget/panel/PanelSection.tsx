// Astal
import { Astal, Gtk } from 'astal/gtk3';
import { Variable, bind } from 'astal';

// Libraries
import PanelLib from '../../state/panel/panel';
const panel = PanelLib.get_default();

// Config
import Config from '../../state/config/config';
const config = Config.get_default();
const spacing = bind(
  Variable(config.appearance.paddingBase).observe(
    config.appearance,
    'updated',
    () => config.appearance.paddingBase
  )
);

// Functions
import { playSound } from '../../utils/play_sound';

// Widgets
import { MaterialIcon } from '../common/MaterialIcon';

interface PanelSection {
  section: string;
  title: Gtk.Widget;
  icon: string;
  children?: Gtk.Widget[];
  child?: Gtk.Widget;
}

export const PanelSection = ({ section, title, icon, child }: PanelSection) => {
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
            panel.togglePanel(panel.monitor, 'panel', section);
          }
        }}
        onClickRelease={() => className.set('')}
      >
        <box className='title-bar' spacing={spacing} valign={Gtk.Align.CENTER}>
          <MaterialIcon icon={icon} size={1.25} />
          <box hexpand>{title}</box>
          <MaterialIcon
            icon={bind(panel, 'section').as((es) =>
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
        revealChild={bind(panel, 'section').as((v) => v === section)}
      >
        {child}
      </revealer>
    );
  };

  return (
    <box vertical spacing={spacing} className={bind(className).as((v) => `panel-section ${v}`)}>
      <Bar />
      <Content />
    </box>
  );
};
