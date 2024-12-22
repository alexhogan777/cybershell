// Astal
import GObject, { register, property, signal } from 'astal/gobject';
import { monitorFile, readFileAsync, readFile, writeFile, writeFileAsync } from 'astal/file';
import { App } from 'astal/gtk3';
import { exec } from 'astal/process';

// Config
import { HOME } from '../../config/user_config';
const OPTIONS = `${HOME}/.config/cybershell/localization.json`;

function getFromOptions(key: string) {
  return JSON.parse(readFile(OPTIONS))[key];
}

@register({ GTypeName: 'ConfigLocalization' })
export default class Localization extends GObject.Object {
  static instance: Localization;
  static get_default() {
    if (!this.instance) this.instance = new Localization();
    return this.instance;
  }

  updateOption(key: string, value: any) {
    let _options = JSON.parse(readFile(OPTIONS));
    _options[key] = value;

    writeFile(OPTIONS, JSON.stringify(_options));
  }

  #dateFormat = getFromOptions('dateFormat');
  #dateFormatNotification = getFromOptions('dateFormatNotification');
  #timeFormat = getFromOptions('timeFormat');
  #timeFormatNotification = getFromOptions('timeFormatNotification');

  @property(String)
  get dateFormat() {
    return this.#dateFormat;
  }
  set dateFormat(value) {
    this.updateOption('dateFormat', value);
  }
  @property(String)
  get dateFormatNotification() {
    return this.#dateFormatNotification;
  }
  set dateFormatNotification(value) {
    this.updateOption('dateFormatNotification', value);
  }
  @property(String)
  get timeFormat() {
    return this.#timeFormat;
  }
  set timeFormat(value) {
    this.updateOption('timeFormat', value);
  }
  @property(String)
  get timeFormatNotification() {
    return this.#timeFormatNotification;
  }
  set timeFormatNotification(value) {
    this.updateOption('timeFormatNotification', value);
  }

  @signal(Localization)
  updated(value: Localization) {
    return value;
  }

  constructor() {
    super();

    monitorFile(OPTIONS, async (f) => {
      const v = await readFileAsync(f).then((value) => JSON.parse(value));
      if (v.dateFormat !== this.#dateFormat) {
        this.#dateFormat = v.dateFormat;
        this.notify('dateFormat');
        this.emit('updated', this);
      }
      if (v.dateFormatNotification !== this.#dateFormatNotification) {
        this.#dateFormatNotification = v.dateFormatNotification;
        this.notify('dateFormatNotification');
        this.emit('updated', this);
      }
      if (v.timeFormat !== this.#timeFormat) {
        this.#timeFormat = v.timeFormat;
        this.notify('timeFormat');
        this.emit('updated', this);
      }
      if (v.timeFormatNotification !== this.#timeFormatNotification) {
        this.#timeFormatNotification = v.timeFormatNotification;
        this.notify('timeFormatNotification');
        this.emit('updated', this);
      }
    });
  }
}
