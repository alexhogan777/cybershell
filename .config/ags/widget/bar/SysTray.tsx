import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { Variable, GLib, bind } from 'astal';
import Tray from 'gi://AstalTray';
import { userConfig } from '../../config/user_config';
import { playSound } from '../../utils/play_sound';
const tray = Tray.get_default();

export const SysTray = () => {
  const TrayItem = (trayItem: Tray.TrayItem) => {
    const menu = trayItem.create_menu();

    return (
      <button
        name={trayItem.title}
        cursor='pointer'
        onClickRelease={(self, event) => {
          function openMenu() {
            menu?.popup_at_widget(
              self,
              Gdk.Gravity.SOUTH,
              Gdk.Gravity.NORTH,
              null
            );
          }
          playSound('button');
          if (event.button === Astal.MouseButton.PRIMARY) {
            openMenu();
          }
          if (event.button === Astal.MouseButton.SECONDARY) {
            openMenu();
          }
          if (event.button === Astal.MouseButton.MIDDLE) {
          }
        }}
        tooltipMarkup={bind(trayItem, 'tooltipMarkup').as((ttmu) => {
          if (!ttmu) return trayItem.title;
          return ttmu;
        })}
      >
        <icon gIcon={bind(trayItem, 'gicon')} css='font-size: 1.75em;' />
      </button>
    );
  };

  return (
    <box
      className='Sys-Tray'
      halign={Gtk.Align.CENTER}
      vertical
      spacing={userConfig.appearance.spacing}
    >
      {bind(tray, 'items').as((tis) => tis.map(TrayItem))}
    </box>
  );
};
