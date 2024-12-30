// Astal
import GObject, { register, property, signal } from 'astal/gobject';
import { monitorFile, readFile, writeFile, readFileAsync, writeFileAsync } from 'astal';

import { HOME } from '../../config/user_config';
const OPTIONS = `${HOME}/.config/cybershell/bar.json`;

function getFromOptions(key: string) {
  return JSON.parse(readFile(OPTIONS))[key];
}

@register({ GTypeName: 'ConfigBar' })
export default class Bar extends GObject.Object {
  static instance: Bar;
  static get_default() {
    if (!this.instance) this.instance = new Bar();

    return this.instance;
  }

  updateOption(key: string, value: any) {
    let _options = JSON.parse(readFile(OPTIONS));
    _options[key] = value;

    writeFile(OPTIONS, JSON.stringify(_options));
  }

  #autoHide: boolean = getFromOptions('autoHide');
  #autoHideDelay: number = getFromOptions('autoHideDelay');
  #displayMode: 'default' | 'all' | number[] = getFromOptions('displayMode');
  #displayAnchor: 'top' | 'right' | 'bottom' | 'left' = getFromOptions('displayAnchor');
  #wsInactive: boolean = getFromOptions('wsInactive');
  #wsNumber: number = getFromOptions('wsNumber');
  #wsScratch: boolean = getFromOptions('wsScratch');

  @property(Boolean)
  get autoHide() {
    return this.#autoHide;
  }
  set autoHide(value) {
    this.updateOption('autoHide', value);
  }

  @property(Number)
  get autoHideDelay() {
    return this.#autoHideDelay;
  }
  set autoHideDelay(value) {
    this.updateOption('autoHideDelay', value);
  }

  @property()
  get displayMode() {
    return this.#displayMode;
  }
  set displayMode(value) {
    this.updateOption('displayMode', value);
  }

  @property()
  get displayAnchor() {
    return this.#displayAnchor;
  }
  set displayAnchor(value) {
    this.updateOption('displayAnchor', value);
  }

  @property(Boolean)
  get wsInactive() {
    return this.#wsInactive;
  }
  set wsInactive(value) {
    this.updateOption('wsInactive', value);
  }

  @property(Number)
  get wsNumber() {
    return this.#wsNumber;
  }
  set wsNumber(value) {
    this.updateOption('wsNumber', value);
  }

  @property(Boolean)
  get wsScratch() {
    return this.#wsScratch;
  }
  set wsScratch(value) {
    this.updateOption('wsScratch', value);
  }

  @signal(Bar)
  updated(value: Bar) {
    return value;
  }

  constructor() {
    super();

    monitorFile(OPTIONS, async (f) => {
      const v = await readFileAsync(f).then((value) => JSON.parse(value));
      if (v.autoHide !== this.#autoHide) {
        this.#autoHide = v.autoHide;
        this.emit('updated', this);
        this.notify('autoHide');
      }
      if (v.autoHideDelay !== this.#autoHideDelay) {
        this.#autoHideDelay = v.autoHideDelay;
        this.emit('updated', this);
        this.notify('autoHideDelay');
      }
      if (v.displayMode !== this.#displayMode) {
        this.#displayMode = v.displayMode;
        this.emit('updated', this);
        this.notify('displayMode');
      }
      if (v.displayAnchor !== this.#displayAnchor) {
        this.#displayAnchor = v.displayAnchor;
        this.emit('updated', this);
        this.notify('displayAnchor');
      }
      if (v.wsInactive !== this.#wsInactive) {
        this.#wsInactive = v.wsInactive;
        this.emit('updated', this);
        this.notify('wsInactive');
      }
      if (v.wsNumber !== this.#wsNumber) {
        this.#wsNumber = v.wsNumber;
        this.emit('updated', this);
        this.notify('wsNumber');
      }
      if (v.wsScratch !== this.#wsScratch) {
        this.#wsScratch = v.wsScratch;
        this.emit('updated', this);
        this.notify('wsScratch');
      }
    });
  }
}
