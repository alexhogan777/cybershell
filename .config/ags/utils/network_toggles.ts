// Astal
import { Gio, execAsync } from 'astal';

// Libraries
import Network from 'gi://AstalNetwork';
const network = Network.get_default();
const wifi = network.get_wifi();
const wired = network.get_wired();

export function toggleWifi() {
  const newVal = !wifi?.get_enabled();
  wifi?.set_enabled(newVal);
  return newVal;
}

export function toggleEthernet() {
  try {
    wired?.get_device().disconnect(new Gio.Cancellable());
    return false;
  } catch {
    let ifname = '';
    execAsync([
      'bash',
      '-c',
      `nmcli device status | awk '/ethernet/ {print $1}'`,
    ])
      .then((res) => (ifname = res))
      .finally(() =>
        execAsync(['bash', '-c', `nmcli device connect ${ifname}`])
      );
    return true;
  }
}
