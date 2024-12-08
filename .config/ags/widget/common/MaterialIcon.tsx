import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { Variable, GLib, bind, Binding } from 'astal';

interface props {
  icon: string | Binding<string>;
  size?: number;
  props?: any;
  css?: string;
}

export const MaterialIcon = ({
  icon = '',
  size = 1,
  css = '',
  ...props
}: props) => {
  return (
    <label
      className='icon-material'
      css={`
        font-size: ${size}em;
        ${css}
      `}
      label={icon}
      halign={Gtk.Align.CENTER}
    />
  );
};
