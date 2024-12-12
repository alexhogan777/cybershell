import { App } from 'astal/gtk3';
import style from './style.scss';
import { Bar } from './widget/bar/main';
import { ClickCloseRegion } from './widget/click_close_region';
import { Panel, togglePanel } from './widget/panel/main';
import { exec, monitorFile, readFile, timeout, Variable } from 'astal';
import { configPath, HOME } from './config/user_config';
import { Popups } from './widget/popups/main';
import Hyprland from 'gi://AstalHyprland';
import { SystemSounds } from './widget/system_sounds';
import { syncConfig } from './config/styles';
const hyprland = Hyprland.get_default();

export const nightLightState = Variable(
  JSON.parse(readFile(`${configPath}/night_light.json`))
);
monitorFile(`${configPath}/night_light.json`, (file) => {
  nightLightState.set(JSON.parse(readFile(file)));
});

function getStyle() {
  syncConfig();
  exec(['sass', './style.scss', '/tmp/style.css']);
  App.apply_css('/tmp/style.css');
}

App.start({
  main() {
    getStyle();
    SystemSounds();
    App.get_monitors().map(Bar);
    App.get_monitors().map(ClickCloseRegion);
    App.get_monitors().map(Popups);
    App.get_monitors().map(Panel);
  },
  requestHandler(request: string, res: (response: any) => void) {
    const requestArr = request.split(' ');
    const command = requestArr[0];
    const option = requestArr[1];
    const value = requestArr[2];
    const currentMonitorInt = hyprland.get_focused_monitor().id;

    if (command === 'togglePanel') {
      if (option === '-s') {
        togglePanel(currentMonitorInt, value);
        res(`Toggling Panel-${currentMonitorInt} expanding section "${value}"`);
      } else {
        togglePanel(currentMonitorInt);
        res(`Toggling Panel-${currentMonitorInt}`);
      }
    }
  },
});
