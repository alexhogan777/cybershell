import GObject, { register, property, signal } from 'astal/gobject';
import {
  monitorFile,
  readFileAsync,
  readFile,
  writeFileAsync,
} from 'astal/file';
import { interval } from 'astal';
import { exec, execAsync, subprocess } from 'astal/process';
import { configPath, HOME } from '../../config/user_config';

const statePath = `${HOME}/.config/ags/state/nightlight`;
const temperaturePath = `${statePath}/temperature`;
const timeEnablePath = `${statePath}/time_enable`;
const timeDisablePath = `${statePath}/time_disable`;
const nextEnablePath = `${statePath}/next_enable`;
const nextDisablePath = `${statePath}/next_disable`;

@register({ GTypeName: 'NightLight' })
export default class NightLight extends GObject.Object {
  static instance: NightLight;
  static get_default() {
    if (!this.instance) this.instance = new NightLight();

    return this.instance;
  }

  #enabled = false;
  #temperature = Number(readFile(temperaturePath));
  #timeEnable = Number(readFile(timeEnablePath));
  #timeDisable = Number(readFile(timeDisablePath));
  #nextEnable = readFile(nextEnablePath);
  #nextDisable = readFile(nextDisablePath);

  @property(Boolean)
  get enabled() {
    return this.#enabled;
  }

  set enabled(value) {
    if (value) {
      execAsync(`hyprsunset -t ${this.#temperature}`);
    } else {
      execAsync(`killall hyprsunset`);
    }
    this.#enabled = value;
    this.notify('enabled');
  }

  @property(Number)
  get temperature() {
    return this.#temperature;
  }

  set temperature(value) {
    writeFileAsync(temperaturePath, String(value)).then(() => {
      this.#temperature = value;
      this.notify('temperature');
    });
  }

  @property(Number)
  get timeEnable() {
    return this.#timeEnable;
  }
  set timeEnable(value) {
    writeFileAsync(timeEnablePath, String(value)).then(() => {
      this.#timeEnable = value;
      this.notify('time_enable');
    });
  }
  @property(Number)
  get timeDisable() {
    return this.#timeDisable;
  }
  set timeDisable(value) {
    writeFileAsync(timeDisablePath, String(value)).then(() => {
      this.#timeDisable = value;
      this.notify('time_disable');
    });
  }

  @property(String)
  get nextEnable() {
    return this.#nextEnable;
  }
  set nextEnable(value) {
    writeFileAsync(nextEnablePath, String(value)).then(() => {
      this.#nextEnable = value;
      this.notify('next_enable');
    });
  }
  @property(String)
  get nextDisable() {
    return this.#nextDisable;
  }
  set nextDisable(value) {
    writeFileAsync(nextDisablePath, String(value)).then(() => {
      this.#nextDisable = value;
      this.notify('next_Disable');
    });
  }

  constructor() {
    super();

    interval(1000, () => {
      const now = new Date(Date.now());
      const isAM = now.getHours() < 12;
      const minuteEnable = String(this.#timeEnable).slice(-2);
      const hourEnable = String(this.#timeEnable).slice(
        0,
        String(this.#timeEnable).lastIndexOf(minuteEnable)
      );
      const minuteDisable = String(this.#timeDisable).slice(-2);
      const hourDisable = String(this.#timeDisable).slice(
        0,
        String(this.#timeDisable).lastIndexOf(minuteDisable)
      );

      if (!this.#nextEnable) {
        let _nextEnable = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + (isAM ? -1 : 0),
          Number(hourEnable),
          Number(minuteEnable)
        );
        let _nextDisable = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + (isAM ? 0 : 1),
          Number(hourDisable),
          Number(minuteDisable)
        );

        writeFileAsync(nextEnablePath, String(_nextEnable));
        writeFileAsync(nextDisablePath, String(_nextDisable));
      } else {
        let _nextEnable = new Date(this.#nextEnable);
        let _nextDisable = new Date(this.#nextDisable);

        /* 
          Possible scenarios:
            1. now < _nextEnable < _nextDisable : do nothing
            2. now < _nextDisable < _nextEnable : do nothing
            2. _nextEnable < now < _nextDisable : enable & set new enable Date
            3. _nextDisable < now < _nextEnable : disable & set new disable Date
            4. _nextEnable < _nextDisable < now : reset dates
        */

        if (now < _nextEnable && _nextEnable < _nextDisable) {
          // Waiting for enable
        } else if (now < _nextDisable && _nextDisable < _nextEnable) {
          // Waiting for disable
        } else if (_nextEnable <= now && now < _nextDisable) {
          // Should enable
          execAsync(`hyprsunset -t ${this.#temperature}`);
          writeFileAsync(
            nextEnablePath,
            String(
              new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + (isAM ? 0 : 1),
                Number(hourEnable),
                Number(minuteEnable)
              )
            )
          );
        } else if (_nextDisable <= now && now < _nextEnable) {
          // Should disable
          execAsync(`killall hyprsunset`);
          writeFileAsync(
            nextDisablePath,
            String(
              new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1,
                Number(hourDisable),
                Number(minuteDisable)
              )
            )
          );
        } else {
          // Invalid
          throw '[NightLight] Invalid enable/disable Date scenario; resetting Dates.';
        }
      }

      execAsync('pidof hyprsunset')
        .then(() => {
          if (this.#enabled) return;
          this.#enabled = true;
          this.notify('enabled');
        })
        .catch(() => {
          if (!this.#enabled) return;
          this.#enabled = false;
          this.notify('enabled');
        });
    });

    monitorFile(
      `${HOME}/.config/ags/state/nightlight/temperature`,
      async (f) => {
        const v = await readFileAsync(f);
        this.#temperature = Number(v);
        this.notify('temperature');
      }
    );

    monitorFile(timeEnablePath, async (f) => {
      const v = await readFileAsync(f);
      this.#timeEnable = Number(v);
      this.notify('time_enable');
    });

    monitorFile(timeDisablePath, async (f) => {
      const v = await readFileAsync(f);
      this.#timeDisable = Number(v);
      this.notify('time_disable');
    });

    monitorFile(nextEnablePath, async (f) => {
      const v = await readFileAsync(f);
      this.#nextEnable = String(v);
      this.notify('next_enable');
    });

    monitorFile(nextDisablePath, async (f) => {
      const v = await readFileAsync(f);
      this.#nextDisable = String(v);
      this.notify('next_disable');
    });
  }
}
