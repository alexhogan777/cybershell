import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { Variable, GLib, bind, Binding } from 'astal';

import Notifd from 'gi://AstalNotifd';
const notifd = Notifd.get_default();

const Notification = (notif: Notifd.Notification) => {
  return <box>{notif.summary}</box>;
};

export const NotificationPopups = () => {
  return (
    <box>{bind(notifd, 'notifications').as((ns) => ns.map(Notification))}</box>
  );
};
