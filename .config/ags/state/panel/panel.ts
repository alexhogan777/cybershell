// Astal
import GObject, { register, property, signal } from 'astal/gobject';
import { monitorFile, readFileAsync, readFile, writeFileAsync, writeFile } from 'astal/file';
import { App, Astal } from 'astal/gtk3';

// Config
import Bar from '../config/bar';
const bar = Bar.get_default();

import { HOME, STATE } from '../../config/user_config';
import { getLayout } from '../../utils/get_layout';
import { execAsync } from 'astal';
const OPTIONS = `${HOME}/.config/cybershell/panel.json`;
const SECTION = `${STATE}/panel/section`;

function getFromOptions(key: string) {
  return JSON.parse(readFile(OPTIONS))[key];
}

function getInitialAnchor() {
  const _initialAnchor = getFromOptions('anchor');
  switch (_initialAnchor) {
    case 'right':
      return Astal.WindowAnchor.RIGHT;
    default:
      return Astal.WindowAnchor.LEFT;
  }
}

@register({ GTypeName: 'Panel' })
export default class Panel extends GObject.Object {
  static instance: Panel;
  static get_default() {
    if (!this.instance) this.instance = new Panel();

    return this.instance;
  }

  updateOption(key: string, value: any) {
    let _options = JSON.parse(readFile(OPTIONS));
    _options[key] = value;

    writeFile(OPTIONS, JSON.stringify(_options));
  }

  #visible = false;
  #monitor = 0;
  #initialAnchor = getInitialAnchor();
  #anchor = this.#initialAnchor;
  #defaultSection = getFromOptions('defaultSection');
  #section = this.#defaultSection;

  @property(Boolean)
  get visible() {
    return this.#visible;
  }
  set visible(value) {
    this.#visible = value;
    this.notify('visible');
    this.emit('toggled', this);
  }

  @property(Number)
  get monitor() {
    return this.#monitor;
  }
  set monitor(value) {
    this.#monitor = value;
    this.notify('monitor');
  }

  @property()
  get anchor() {
    return this.#anchor;
  }
  set anchor(value) {
    this.#anchor = value;
    this.notify('anchor');
  }

  @property(String)
  get section() {
    return this.#section;
  }

  set section(value) {
    writeFileAsync(SECTION, value);
  }

  @property(String)
  get defaultSection() {
    return this.#defaultSection;
  }
  set defaultSection(value) {}

  @signal(Panel)
  toggled(value: Panel) {
    return value;
  }

  @signal(Panel)
  updated(value: Panel) {
    return value;
  }

  togglePanel(monitorInt: number, source: string, section?: string, anchor?: Astal.WindowAnchor) {
    const differentMonitor = this.#monitor !== monitorInt;
    const differentSection = section && this.#section !== section;
    const differentAnchor = anchor && this.#anchor !== anchor;

    function openPanel(_this: any) {
      _this.visible = true;
    }
    function closePanel(_this: any) {
      _this.visible = false;
    }
    function resetSection(_this: any) {
      _this.section = _this.#defaultSection;
    }
    function changeSection(_this: any) {
      _this.section = section;
    }
    function changeMonitor(_this: any) {
      _this.monitor = monitorInt;
    }
    function resetAnchor(_this: any) {
      _this.anchor = getInitialAnchor();
    }
    function changeAnchor(_this: any) {
      if (differentAnchor) _this.anchor = anchor;
    }

    switch (source) {
      case 'keybind':
        if (!this.visible) {
          changeMonitor(this);
          changeSection(this);
          openPanel(this);
        } else {
          if (differentMonitor) {
            resetAnchor(this);
            changeSection(this);
            changeMonitor(this);
          } else {
            if (differentSection && section !== this.#defaultSection) {
              changeMonitor(this);
              resetAnchor(this);
              changeSection(this);
            } else {
              resetAnchor(this);
              resetSection(this);
              closePanel(this);
            }
          }
        }
        break;
      case 'bar':
        changeAnchor(this);
        if (!this.visible) {
          changeMonitor(this);
          changeSection(this);
          openPanel(this);
        } else {
          if (differentMonitor) {
            changeMonitor(this);
            if (differentSection) {
              changeSection(this);
            }
          } else {
            if (differentSection) {
              changeSection(this);
            } else {
              resetAnchor(this);
              resetSection(this);
              closePanel(this);
            }
          }
        }
        break;
      case 'panel':
        if (differentSection) {
          changeSection(this);
        } else {
          resetSection(this);
        }
        break;
      case 'ccr':
        resetAnchor(this);
        resetSection(this);
        closePanel(this);
    }
    this.emit('updated', this);
  }

  constructor() {
    super();

    monitorFile(SECTION, async (f) => {
      const v = await readFileAsync(f).catch(() => {});
      this.#section = v;
      this.notify('section');
      this.emit('updated', this);
    });
    monitorFile(OPTIONS, async (f) => {
      const v = await readFileAsync(f).then((v) => JSON.parse(v));
      if (v.anchor !== this.#initialAnchor) {
        this.#initialAnchor === getInitialAnchor();
      }
      if (v.defaultSection !== this.#defaultSection) {
        this.#defaultSection === v.defaultSection();
      }
    });
  }
}
