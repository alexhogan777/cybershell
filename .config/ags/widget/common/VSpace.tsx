import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { Variable, GLib, bind } from 'astal';
import { userConfig } from '../../config/user_config';

export const VSpace = () => {
  return (
    <box vexpand vertical={true} spacing={userConfig.appearance.spacing} />
  );
};
