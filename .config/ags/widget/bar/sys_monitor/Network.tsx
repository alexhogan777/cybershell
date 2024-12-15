// Astal
import { Gtk } from 'astal/gtk3';
import { bind } from 'astal';

// Libraries
import Network from 'gi://AstalNetwork';
const network = Network.get_default();

// Functions
import { getFriendlyNetworkState } from '../../../utils/friendly';

// Widgets
import { XButton } from '../../common/XButton';

export const NetworkMonitor = () => {
  const Wired = (nw: Network.Wired) => {
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
  const Wifi = (nw: Network.Wifi) => {
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
        if (v === Network.Primary.WIFI) return Wifi(network.wifi);
        if (v === Network.Primary.WIRED) return Wired(network.wired);
        if (v === Network.Primary.UNKNOWN) return Unknown();
      })}
    </box>
  );
};
