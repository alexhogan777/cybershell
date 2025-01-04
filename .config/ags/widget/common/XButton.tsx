// Astal
import { Astal, Gtk } from 'astal/gtk3';
import { bind, Variable } from 'astal';

// Config
import Config from '../../state/config/config';
const config = Config.get_default();
const SPACING = bind(
  Variable(config.appearance.paddingBase).observe(
    config.appearance,
    'updated',
    () => config.appearance.paddingBase
  )
);

// Functions
import { playSound } from '../../utils/play_sound';

// Widgets
import { MaterialIcon } from './MaterialIcon';

interface XButton {
  iconObj: { icon: string; size: number };
  label: string;
  children?: Gtk.Widget[];
  child?: Gtk.Widget;
  vertical: boolean;
  spacing: number;
  onClick: (self: Astal.Button, event: Astal.ClickEvent) => void;
  onHover: (self: Astal.Button, event: Astal.HoverEvent) => void;
  corners?: 'normal' | 'reversed';
}

export const XButton = ({
  iconObj = { icon: '', size: 1 },
  label = '',
  children = [],
  child,
  vertical = false,
  spacing = SPACING,
  onClick,
  onHover,
  corners,
  ...props
}: any) => {
  return (
    <button
      {...props}
      onClick={(self: Gtk.Button, event: Astal.ClickEvent) => {
        playSound('button');
        if (onClick) onClick(self, event);
      }}
      onHover={(self, event) => {
        playSound('hover');
        if (onHover) onHover(self, event);
      }}
    >
      <box
        spacing={spacing}
        vertical={vertical}
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
      >
        {iconObj.icon !== '' && <MaterialIcon icon={iconObj.icon} size={iconObj.size} />}
        {label !== '' && <label label={label} />}
        {child && child}
        {children && children}
      </box>
    </button>
  );
};
