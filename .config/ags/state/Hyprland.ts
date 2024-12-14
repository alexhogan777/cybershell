// Astal
import { Variable, bind } from 'astal';

// Libraries
import Hyprland from 'gi://AstalHyprland';
export const hyprland = Hyprland.get_default();

export const activeMonitorInt = Variable(hyprland.get_focused_monitor().id);

bind(hyprland, 'focusedMonitor').subscribe(({ id }) =>
  activeMonitorInt.set(id)
);
