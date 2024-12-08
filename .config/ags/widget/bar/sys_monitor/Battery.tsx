import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { Variable, GLib, bind, execAsync, exec } from 'astal';
import { userConfig } from '../../../config/user_config';
import Battery from 'gi://AstalBattery';
import { XButton } from '../../common/XButton';
const battery = Battery.get_default();

export const BatteryMonitor = () => {
  const Content = () => {
    return (
      <XButton
        tooltipText={`${
          battery.charging ? 'Charging' : 'Discharging'
        } | ${Math.floor(battery.percentage * 100)}%`}
      >
        <icon icon={battery.batteryIconName} />
      </XButton>
    );
  };
  return (
    <box
      halign={Gtk.Align.CENTER}
      visible={bind(battery, 'isPresent')}
      setup={(self) => {
        function update() {
          self.child = battery.isPresent ? <Content /> : <box />;
        }
        self.hook(battery, 'notify', update);
      }}
    >
      {bind(battery, 'isPresent').as((v) => {
        if (v) return <Content />;
        return <box />;
      })}
    </box>
  );
};
