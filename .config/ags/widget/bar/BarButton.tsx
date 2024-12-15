// Astal
import { Astal, Gtk } from 'astal/gtk3';

// Config
import { userConfig } from '../../config/user_config';

// Functions
import { togglePanel } from '../panel/main';

// Widgets
import { XButton } from '../common/XButton';

export const BarButton = ({
  icon = '',
  children = [],
  section = '',
  css = '',
  spacing = userConfig.appearance.spacing,
  monitorInt = 0,
  onClick,
  ...props
}: any) => {
  return (
    <XButton
      vertical={true}
      iconObj={{ icon: icon, size: 1.5 }}
      halign={Gtk.Align.CENTER}
      spacing={spacing}
      css={css}
      {...props}
      onClick={
        onClick
          ? onClick
          : (_: any, event: Astal.ClickEvent) => {
              if (event.button === Astal.MouseButton.PRIMARY)
                togglePanel(monitorInt, section);
            }
      }
    >
      {children}
    </XButton>
  );
};
