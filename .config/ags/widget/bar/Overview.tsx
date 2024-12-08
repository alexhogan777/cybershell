import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { Variable, GLib, bind, execAsync } from 'astal';
import { BarButton } from './BarButton';
import { playSound } from '../../utils/play_sound';
import { userConfig } from '../../config/user_config';
import { getLayout } from '../../utils/get_layout';
import { execAsyncClose } from '../../utils/execClose';

export const Overview = ({ monitorInt }: { monitorInt: number }) => {
  return (
    <BarButton
      icon='apps'
      section='Overview'
      tooltipText='Open Overview (Hyprswitch)'
      onClick={(self: Gtk.Widget, event: Astal.ClickEvent) => {
        if (event.button === Astal.MouseButton.PRIMARY) {
          execAsyncClose('hyprctl dispatch overview:toggle');
        }
      }}
    />
  );
};
