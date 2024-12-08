// @ts-nocheck
import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { Variable, GLib, bind, Binding, execAsync } from 'astal';
import { userConfig } from '../config/user_config';

function random() {
  return Math.floor(Math.random() * 3) + 1;
}

export function playSound(
  sound:
    | 'button'
    | 'hover'
    | 'open'
    | 'dismiss'
    | 'new'
    | 'close'
    | 'grab'
    | 'drop'
    | 'notification_low'
    | 'notification_normal'
    | 'notification_critical'
    | 'startup'
    | 'default'
) {
  const settings = userConfig.sounds;
  let _sound = '';

  if (settings.enabled) {
    switch (sound) {
      case 'button':
        _sound = settings.buttonEnabled && settings[`button0${random()}`];
        break;
      case 'hover':
        _sound = settings.hoverEnabled && settings[sound];
        break;
      case 'open':
        _sound = settings.opendismissEnabled && settings[sound];
        break;
      case 'dismiss':
        _sound = settings.opendismissEnabled && settings[sound];
        break;
      case 'new':
        _sound = settings.newcloseEnabled && settings[sound];
        break;
      case 'close':
        _sound = settings.newcloseEnabled && settings[sound];
        break;
      case 'grab':
        _sound = settings.grabdropEnabled && settings[sound];
        break;
      case 'drop':
        _sound = settings.grabdropEnabled && settings[sound];
        break;
      case 'notification_low':
        _sound = settings.notificationEnabled && settings[sound];
        break;
      case 'notification_normal':
        _sound = settings.notificationEnabled && settings[sound];
        break;
      case 'notification_critical':
        _sound = settings.notificationEnabled && settings[sound];
        break;
      case 'startup':
        _sound = settings.startupEnabled && settings[sound];
        break;
      case 'default':
        _sound = settings['notificationLow'];
        break;
    }
  }

  if (!_sound) return;
  execAsync(['bash', '-c', `play ${_sound}`]).catch(print);
}
