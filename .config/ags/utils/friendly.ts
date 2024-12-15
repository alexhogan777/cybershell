// Astal
import { GLib } from 'astal';

// Libraries
import Config from '../state/config/config';
const config = Config.get_default();

// Functions
import { assetsPath, userConfig } from '../config/user_config';

export function getFriendlySearchEngine(engine: string) {
  const test = (v: string) => {
    return engine.includes(v);
  };
  switch (true) {
    // I took these from the default search engines in Vivaldi. I haven't heard of a few of them either.
    case test('google'):
      return 'Google';
    case test('bing'):
      return 'Bing';
    case test('yahoo'):
      return 'Yahoo!';
    case test('duckduckgo'):
      return 'DuckDuckGo';
    case test('ecosia'):
      return 'Ecosia';
    case test('qwant'):
      return 'Qwant';
    case test('startpage'):
      return 'Startpage.com';
  }
}

import Notifd from 'gi://AstalNotifd';
export function getFriendlyNotifAppIcon(notif: Notifd.Notification) {
  const { body, summary, appIcon } = notif;
  const APP_ICONS = `${assetsPath}/app_icons`;

  if (summary.includes('Instagram')) return `${APP_ICONS}/instagram.png`;
  if (summary.includes('YouTube')) return `${APP_ICONS}/youtube.png`;

  return appIcon;
}

export function getFriendlyNotifTitle(title: string) {
  const _title = title.toLowerCase();

  if (_title.includes('instagram:')) return title.slice(title.indexOf(':') + 2);
  return title;
}

export function getFriendlyNotifTime(time: number) {
  // Thx end-4 <3

  const messageTime = GLib.DateTime.new_from_unix_local(time);
  const oneMinuteAgo = GLib.DateTime.new_now_local().add_seconds(-60);
  // @ts-expect-error
  if (messageTime.compare(oneMinuteAgo) > 0) return 'Now';
  else if (
    messageTime.get_day_of_year() ==
    GLib.DateTime.new_now_local().get_day_of_year()
  )
    return messageTime.format(config.localization.timeFormatNotification);
  else if (
    messageTime.get_day_of_year() ==
    GLib.DateTime.new_now_local().get_day_of_year() - 1
  )
    return 'Yesterday';
  else return messageTime.format(config.localization.dateFormatNotification);
}

export function getFriendlyNotifBody(body: string) {
  const _body = body.toLowerCase();
  if (_body.includes('pushbullet'))
    return body.slice(_body.indexOf('\n\n') + 2, _body.length - 1);
  return body;
}
export function getFriendlyNotifBodyRetracted(body: string) {
  const friendlyBody = getFriendlyNotifBody(body);
  const lastNewLine = friendlyBody.lastIndexOf('\n');
  if (lastNewLine !== -1) return `… ${friendlyBody.slice(lastNewLine + 1)}`;
  return friendlyBody;
}

export interface FriendlyAction {
  name?: string;
  icon?: string;
  action: Notifd.Action;
}
export function getFriendlyNotifActions(actions: Notifd.Action[]) {
  const excludedActions = ['default', 'dismiss', 'activate'];
  let friendlyActions: FriendlyAction[] = actions
    .filter(
      (a) =>
        !excludedActions.includes(a.id.toLowerCase()) &&
        !excludedActions.includes(a.label.toLowerCase())
    )
    .map((a) => {
      const _label = a.label.toLowerCase();
      let name = a.label;
      let icon;

      if (_label.includes('mute')) icon = 'notifications_off';
      if (_label.includes('settings')) icon = 'settings';
      if (_label.includes('reply')) icon = 'subdirectory_arrow_right';

      const friendlyAction: FriendlyAction = {
        name: name,
        icon: icon,
        action: a,
      };
      return friendlyAction;
    });

  return friendlyActions;
}

export function getFriendlyNetworkState(state: number) {
  switch (state) {
    case 10:
      return 'Unmanaged';
    case 20:
      return 'Unavailable';
    case 30:
      return 'Disconnected';
    case 40:
      return 'Preparing...';
    case 50:
      return 'Configuring...';
    case 60:
      return 'Authentication Needed';
    case 70:
      return 'Configuring IP...';
    case 80:
      return 'Checking IP...';
    case 90:
      return 'Secondary';
    case 100:
      return 'Active';
    case 110:
      return 'Deactivating...';
    case 120:
      return 'Connection Failed';
    default:
      return 'Unknown';
  }
}
