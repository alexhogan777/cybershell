// Astal
import GObject, { register, property, signal } from 'astal/gobject';
import { monitorFile, readFileAsync, readFile, writeFile } from 'astal/file';

// Config
import { HOME, STATE, configPath } from '../../config/user_config';
const OPTIONS = `${HOME}/.config/cybershell/apps.json`;

function getFromOptions(key: string) {
  return JSON.parse(readFile(OPTIONS))[key];
}

@register({ GTypeName: 'ConfigApps' })
export default class Apps extends GObject.Object {
  static instance: Apps;
  static get_default() {
    if (!this.instance) this.instance = new Apps();
    return this.instance;
  }

  updateOption(key: string, value: any) {
    let _options = JSON.parse(readFile(OPTIONS));
    _options[key] = value;

    writeFile(OPTIONS, JSON.stringify(_options));
  }

  #settings = getFromOptions('settings');
  #audioSettings = getFromOptions('audioSettings');
  #wifiSettings = getFromOptions('wifiSettings');
  #networkSettings = getFromOptions('networkSettings');
  #bluetoothSettings = getFromOptions('bluetoothSettings');
  #systemMonitor = getFromOptions('systemMonitor');
  #terminal = getFromOptions('terminal');
  #terminalAlt = getFromOptions('terminalAlt');
  #webBrowser = getFromOptions('webBrowser');
  #webBrowserAlt = getFromOptions('webBrowserAlt');
  #fileManager = getFromOptions('fileManager');
  #fileManagerAlt = getFromOptions('fileManagerAlt');
  #textEditor = getFromOptions('textEditor');
  #codeEditor = getFromOptions('codeEditor');

  @property(String)
  get settings() {
    return this.#settings;
  }
  set settings(value) {
    this.updateOption('settings', value);
  }
  @property(String)
  get audioSettings() {
    return this.#audioSettings;
  }
  set audioSettings(value) {
    this.updateOption('audioSettings', value);
  }
  @property(String)
  get wifiSettings() {
    return this.#wifiSettings;
  }
  set wifiSettings(value) {
    this.updateOption('wifiSettings', value);
  }
  @property(String)
  get networkSettings() {
    return this.#networkSettings;
  }
  set networkSettings(value) {
    this.updateOption('networkSettings', value);
  }
  @property(String)
  get bluetoothSettings() {
    return this.#bluetoothSettings;
  }
  set bluetoothSettings(value) {
    this.updateOption('bluetoothSettings', value);
  }
  @property(String)
  get systemMonitor() {
    return this.#systemMonitor;
  }
  set systemMonitor(value) {
    this.updateOption('systemMonitor', value);
  }
  @property(String)
  get terminal() {
    return this.#terminal;
  }
  set terminal(value) {
    this.updateOption('terminal', value);
  }
  @property(String)
  get terminalAlt() {
    return this.#terminalAlt;
  }
  set terminalAlt(value) {
    this.updateOption('terminalAlt', value);
  }
  @property(String)
  get webBrowser() {
    return this.#webBrowser;
  }
  set webBrowser(value) {
    this.updateOption('webBrowser', value);
  }
  @property(String)
  get webBrowserAlt() {
    return this.#webBrowserAlt;
  }
  set webBrowserAlt(value) {
    this.updateOption('webBrowserAlt', value);
  }
  @property(String)
  get fileManager() {
    return this.#fileManager;
  }
  set fileManager(value) {
    this.updateOption('fileManager', value);
  }
  @property(String)
  get fileManagerAlt() {
    return this.#fileManagerAlt;
  }
  set fileManagerAlt(value) {
    this.updateOption('fileManagerAlt', value);
  }
  @property(String)
  get textEditor() {
    return this.#textEditor;
  }
  set textEditor(value) {
    this.updateOption('textEditor', value);
  }
  @property(String)
  get codeEditor() {
    return this.#codeEditor;
  }
  set codeEditor(value) {
    this.updateOption('codeEditor', value);
  }

  syncApps() {
    // Apply Hyprland
    let hyprlandConf = readFile(`${HOME}/.config/hypr/hyprland/astal.conf`);
    const hyprlandConfBefore = hyprlandConf.slice(0, hyprlandConf.indexOf('# Apps') - 1);

    hyprlandConf = `${hyprlandConfBefore}
# APPS
$terminal = ${this.#terminal}
$webBrowser = ${this.#webBrowser}
$webBrowserAlt = ${this.#webBrowserAlt}
$fileManager = ${this.#fileManager}
$fileManagerAlt = ${this.#fileManagerAlt}
$textEditor = ${this.#textEditor}
$codeEditor = ${this.#codeEditor}
$settings = ${this.#settings}
$systemMonitor = ${this.#systemMonitor}
$volumeMixer = ${this.#audioSettings}
$terminalAlt = ${this.#terminalAlt}
    `;
    writeFile(`${HOME}/.config/hypr/hyprland/astal.conf`, hyprlandConf);
  }

  @signal(Apps)
  updated(value: Apps) {
    return value;
  }

  constructor() {
    super();
    monitorFile(OPTIONS, async (f) => {
      const v = await readFileAsync(f).then((value) => JSON.parse(value));
      if (v.settings !== this.#settings) {
        this.#settings = v.settings;
        this.notify('settings');
        this.emit('updated', this);
      }
      if (v.audioSettings !== this.#audioSettings) {
        this.#audioSettings = v.audioSettings;
        this.notify('audioSettings');
        this.emit('updated', this);
      }
      if (v.wifiSettings !== this.#wifiSettings) {
        this.#wifiSettings = v.wifiSettings;
        this.notify('wifiSettings');
        this.emit('updated', this);
      }
      if (v.networkSettings !== this.#networkSettings) {
        this.#networkSettings = v.networkSettings;
        this.notify('networkSettings');
        this.emit('updated', this);
      }
      if (v.bluetoothSettings !== this.#bluetoothSettings) {
        this.#bluetoothSettings = v.bluetoothSettings;
        this.notify('bluetoothSettings');
        this.emit('updated', this);
      }
      if (v.systemMonitor !== this.#systemMonitor) {
        this.#systemMonitor = v.systemMonitor;
        this.notify('systemMonitor');
        this.emit('updated', this);
      }
      if (v.terminal !== this.#terminal) {
        this.#terminal = v.terminal;
        this.notify('terminal');
        this.emit('updated', this);
      }
      if (v.terminalAlt !== this.#terminalAlt) {
        this.#terminalAlt = v.terminalAlt;
        this.notify('terminalAlt');
        this.emit('updated', this);
      }
      if (v.webBrowser !== this.#webBrowser) {
        this.#webBrowser = v.webBrowser;
        this.notify('webBrowser');
        this.emit('updated', this);
      }
      if (v.webBrowserAlt !== this.#webBrowserAlt) {
        this.#webBrowserAlt = v.webBrowserAlt;
        this.notify('webBrowserAlt');
        this.emit('updated', this);
      }
      if (v.fileManager !== this.#fileManager) {
        this.#fileManager = v.fileManager;
        this.notify('fileManager');
        this.emit('updated', this);
      }
      if (v.fileManagerAlt !== this.#fileManagerAlt) {
        this.#fileManagerAlt = v.fileManagerAlt;
        this.notify('fileManagerAlt');
        this.emit('updated', this);
      }
      if (v.textEditor !== this.#textEditor) {
        this.#textEditor = v.textEditor;
        this.notify('textEditor');
        this.emit('updated', this);
      }
      if (v.codeEditor !== this.#codeEditor) {
        this.#codeEditor = v.codeEditor;
        this.notify('codeEditor');
        this.emit('updated', this);
      }
      this.syncApps();
    });
  }
}
