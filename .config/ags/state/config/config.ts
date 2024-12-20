// Astal
import GObject, { register, property } from 'astal/gobject';
import { monitorFile, readFile, readFileAsync, writeFileAsync } from 'astal';

// Libraries
import Apps from './apps';
import Appearance from './appearance';
import Localization from './localization';

@register({ GTypeName: 'Config' })
export default class Config extends GObject.Object {
  static instance: Config;
  static get_default() {
    if (!this.instance) this.instance = new Config();
    return this.instance;
  }

  #dummy = readFile(`/home/xandra/.config/ags/state/config/dummy`);
  #appearance = Appearance.get_default();
  #apps = Apps.get_default();
  #localization = Localization.get_default();

  syncConfig() {
    this.#appearance.syncAppearance();
    this.#apps.syncApps();
  }

  @property(String)
  get dummy() {
    return this.#dummy;
  }
  set dummy(value) {
    writeFileAsync(
      `/home/xandra/.config/ags/state/config/dummy`,
      String(value)
    );
  }

  @property(GObject.Object)
  get appearance() {
    return this.#appearance;
  }

  @property(GObject.Object)
  get apps() {
    return this.#apps;
  }

  @property(GObject.Object)
  get localization() {
    return this.#localization;
  }

  constructor() {
    super();

    monitorFile(`/home/xandra/.config/ags/state/config/dummy`, async (f) => {
      const v = await readFileAsync(
        `/home/xandra/.config/ags/state/config/dummy`
      );
      this.#dummy = v;
      this.notify('dummy');
      print(this.#dummy);
    });
  }
}
