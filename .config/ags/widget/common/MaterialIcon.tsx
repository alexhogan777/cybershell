// Astal
import { Gtk } from 'astal/gtk3';
import { Binding } from 'astal';

export const MaterialIcon = ({
  icon = '',
  size = 1,
  css = '',
  ...props
}: {
  icon: string | Binding<string>;
  size?: number;
  props?: any;
  css?: string;
}) => {
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
