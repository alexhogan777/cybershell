// Astal
import GObject, { register, property } from 'astal/gobject';
import {
  monitorFile,
  readFileAsync,
  readFile,
  writeFileAsync,
  writeFile,
} from 'astal/file';
import { App } from 'astal/gtk3';

// Config
import { STATE } from '../../config/user_config';
const SECTION = `${STATE}/panel/section`;

@register({ GTypeName: 'Panel' })
export default class Panel extends GObject.Object {
  static instance: Panel;
  static get_default() {
    if (!this.instance) this.instance = new Panel();

    return this.instance;
  }

  #enabled = false;
  #section = readFile(SECTION);

  @property(Boolean)
  get enabled() {
    return this.#enabled;
  }

  set enabled(value) {
    this.#enabled = value;
    this.notify('enabled');
  }

  @property(String)
  get section() {
    return this.#section;
  }

  set section(value) {
    writeFileAsync(SECTION, value);
  }

  togglePanel(monitorInt: number, section?: string) {
    const windowsOpen = App.get_windows()
      .filter((v) => v.visible)
      .map((v) => v.name);
    const thisPanelName = `Panel-${monitorInt}`;
    const thisPanel = App.get_window(thisPanelName);

    const sectionCheck = section && this.#section !== section;

    if (windowsOpen.includes(thisPanelName)) {
      if (sectionCheck) {
        this.section = section;
      } else {
        thisPanel?.set_visible(false);
        this.notify('enabled');
      }
    } else {
      if (sectionCheck) this.section = section;
      thisPanel?.set_visible(true);
      this.notify('enabled');
    }
  }

  constructor() {
    super();

    monitorFile(SECTION, async (f) => {
      const v = await readFileAsync(f).catch(() => {});
      // @ts-expect-error
      this.#section = v;
      this.notify('section');
    });
  }
}
