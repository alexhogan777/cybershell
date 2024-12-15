// Astal
import { Astal, Gtk } from 'astal/gtk3';

// Functions
import { execAsyncClose } from '../../utils/execClose';

// Widgets
import { BarButton } from './BarButton';

export const Overview = ({ monitorInt }: { monitorInt: number }) => {
  return (
    <BarButton
      icon='apps'
      section='Overview'
      tooltipText='Overview'
      onClick={(self: Gtk.Widget, event: Astal.ClickEvent) => {
        if (event.button === Astal.MouseButton.PRIMARY) {
          execAsyncClose('hyprctl dispatch overview:toggle');
        }
      }}
    />
  );
};
