// Astal
import { Astal, Gtk } from 'astal/gtk3';

// Libraries
import PanelLib from '../../state/panel/panel';
const panel = PanelLib.get_default();

// Config
import Config from '../../state/config/config';
const SPACING = Config.get_default().appearance.paddingBase;

// Widgets
import { XButton } from '../common/XButton';

export const BarButton = ({
  icon = '',
  children = [],
  section = '',
  css = '',
  spacing = SPACING,
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
                panel.togglePanel(monitorInt, section);
            }
      }
    >
      {children}
    </XButton>
  );
};
