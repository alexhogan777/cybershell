// Astal
import { Gtk } from 'astal/gtk3';
import { bind } from 'astal';

// Libraries
import Battery from 'gi://AstalBattery';
const battery = Battery.get_default();

// Widgets
import { XButton } from '../../common/XButton';

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
