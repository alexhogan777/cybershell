import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { Variable, GLib, bind, execAsync, exec } from 'astal';
import { userConfig } from '../../../config/user_config';
import Network from 'gi://AstalNetwork';
import { XButton } from '../../common/XButton';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { getFriendlyNetworkState } from '../../../utils/friendly';
const network = Network.get_default();

export const NetworkMonitor = () => {
  const Wired = (nw: AstalNetwork.Wired) => {
    return (
      <XButton
        tooltipText={bind(nw, 'state').as(
          (state) => `Ethernet | ${getFriendlyNetworkState(state)}`
        )}
      >
        <icon icon={bind(nw, 'iconName')} />
      </XButton>
    );
  };
  const Wifi = (nw: AstalNetwork.Wifi) => {
    return (
      <XButton
        tooltipText={bind(nw, 'state').as(
          (state) => `${nw.ssid} | ${getFriendlyNetworkState(state)}`
        )}
      >
        <icon icon={bind(nw, 'iconName')} />
      </XButton>
    );
  };
  const Unknown = () => {
    return (
      <XButton
        iconObj={{ icon: 'wifi_off' }}
        tooltipText='Network Unavailable'
      />
    );
  };

  return (
    <box className='Network' halign={Gtk.Align.CENTER}>
      {bind(network, 'primary').as((v) => {
        if (v === AstalNetwork.Primary.WIFI) return Wifi(network.wifi);
        if (v === AstalNetwork.Primary.WIRED) return Wired(network.wired);
        if (v === AstalNetwork.Primary.UNKNOWN) return Unknown();
      })}
    </box>
  );
};
