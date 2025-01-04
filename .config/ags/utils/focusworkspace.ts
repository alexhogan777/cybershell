import { exec } from 'astal';
import Config from '../state/config/config';
const config = Config.get_default();

import Hyprland from 'gi://AstalHyprland';
const hyprland = Hyprland.get_default();

export default function focusWorkspace(option: string, value: number) {
  const maxWS = config.bar.wsNumber;
  const thisMonitorWS = new Array(maxWS)
    .fill(0)
    .map((_, i) => i + 1 + hyprland.get_focused_monitor().id * maxWS);

  if (option === '-i') {
    if (value > 0) {
      if (hyprland.focusedWorkspace.id + value > thisMonitorWS[thisMonitorWS.length - 1]) {
        hyprland.dispatch('workspace', `${thisMonitorWS[thisMonitorWS.length - 1]}`);
      } else {
        hyprland.dispatch('workspace', `+${value}`);
      }
    } else {
      if (hyprland.focusedWorkspace.id + value < thisMonitorWS[0]) {
        hyprland.dispatch('workspace', `${thisMonitorWS[0]}`);
      } else {
        hyprland.dispatch('workspace', `${value}`);
      }
    }
  }
  if (option === '-a') {
  }
  if (option === '-init') {
    const monitors = hyprland.get_monitors().map((v) => v.id);
    if (monitors.length > 1) {
      monitors.forEach((m) => {
        if (m === 0) return;
        hyprland.dispatch('focusmonitor', `${m}`);
        hyprland.dispatch('focusworkspaceoncurrentmonitor', `${m * maxWS + 1}`);
        return;
      });
    }
  }
}
