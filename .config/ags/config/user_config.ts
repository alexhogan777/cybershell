import GLib from 'gi://GLib';
import { readFile } from 'astal';

export const HOME = GLib.getenv('HOME');
export const configPath = `${HOME}/.config/ags/config`;
export const assetsPath = `${HOME}/.config/ags/assets`;
export const soundsPath = `${assetsPath}/sounds`;
const STYLES = JSON.parse(readFile(`${configPath}/styles.json`));
const APPS = JSON.parse(readFile(`${configPath}/apps.json`));

export const userConfig = {
  appearance: {
    spacing: STYLES.paddingBase,
  },
  localization: {
    dateFormat: '%a %m.%d.%Y',
    // you can change the order, but MUST use %m %d and %Y.
    // %m and %d MUST also be adjacent.
    dateFormatNotification: '%a %m.%d',
    timeFormat: '%I:%M:%S%p',
    //if using %p, there MUST NOT be anything between it and the previous selector.
    timeFormatNotification: '%l:%M %p',
  },
  bar: {
    autoHide: false,
    // Currently does nothing. Stay tuned.
    displayMode: <string | number[]>'default',
    // Which monitor(s) to display the bar on. Either 'default', 'all', or an int[].
    // 'default' : Bar on left and right side of first and last monitors respectively.
    // 'all' : Bar on every monitor.
    // int[] : Bar on only these monitors.
    displayAnchor: 'right',
    // Which side of the screen to anchor the bar to when displayMode is set to 'all' or int[]
    // Either 'left' or 'right' (Horizontal bars currently unsupported.)

    workspaces: {
      showInactive: true,
      numShown: 5,
      showScratch: true,
    },
  },
  panel: {
    defaultSection: 'Notifications',
    // This is the section that opens when the panel is opened without specifying a section.
    // (i.e., when the Super key is pressed)
    // Valid values are the visible titles of the panel sections with the first letter capitalized.

    search: {
      resultsShown: 5,
      pinned: [
        'floorp.desktop',
        'steam.desktop',
        'apple-music.desktop',
        'cockos-reaper.desktop',
        'torbrowser.desktop',
        'code.desktop',
      ], // .desktop files
      searchEngine: 'https://www.google.com/search?q=%s',
      // Replace this with the url of the search engine of your choosing.
      // You can probably get it from your browser's settings
      terminal: `${APPS.terminal} --detach --hold`,
    },
  },
  sounds: {
    enabled: true, // Enable/disable all sounds.

    startup: `${soundsPath}/startup.wav`,
    startupEnabled: false,

    notificationLow: `${soundsPath}/notif-low.wav`,
    notificationNormal: `${soundsPath}/notif-normal.wav`,
    notificationCritical: `${soundsPath}/notif-critical.wav`,
    notificationEnabled: true,

    hover: `${soundsPath}/hover.wav`,
    hoverEnabled: false,

    button01: `${soundsPath}/button-01.wav`,
    button02: `${soundsPath}/button-02.wav`,
    button03: `${soundsPath}/button-03.wav`,
    // You can use up to three button sounds.
    // To use only one, just set the same path for all three.
    buttonEnabled: true,

    grab: `${soundsPath}/grab.wav`,
    drop: `${soundsPath}/drop.wav`,
    grabdropEnabled: true,

    open: `${soundsPath}/window-open.wav`,
    dismiss: `${soundsPath}/window-dismiss.wav`,
    opendismissEnabled: true,
    // These are the default 'Whoosh' sounds.

    new: `${soundsPath}/window-new.wav`,
    close: `${soundsPath}/window-close.wav`,
    newcloseEnabled: true,

    disableSoundsWhenOpen: ['REAPER'],
    // If programs with class names matching entries in this array are open, window sounds will not play.
    // This is to solve the annoyance caused by programs that create a lot of popups.
    // Yes this implementation kind of sucks. I tried the "better" one you're thinking of and it didn't work.
    // Use the class revealed by   hyprctl clients
  },
  notifications: {
    popups: {
      enabled: true,
      // Enable/disable notification popups. If sounds are enabled, will still send notif sounds.
      duration: 1500,
      showOn: <string | number[]>'active',
      // Options:
      // 'active': show on active monitor (default)
      // 'all': show on every monitor
      // 'bar': show on any monitor with a bar
      // int[]: show on specified monitor(s)
    },
  },
  programs: {
    settings: APPS.settings,
    audioSettings: APPS.audioSettings,
    wifiSettings: APPS.wifiSettings,
    networkSettings: APPS.networkSettings,
    bluetoothSettings: APPS.bluetoothSettings,
    systemMonitor: APPS.systemMonitor,
  },
  display: {
    nightLight: {
      temperature: 4500,
    },
  },
};
