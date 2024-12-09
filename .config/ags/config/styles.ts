import { execAsync, readFile, writeFile } from 'astal';
import { configPath, HOME } from './user_config';
import Hyprland from 'gi://AstalHyprland';
const hypr = Hyprland.get_default();

const STYLES = JSON.parse(readFile(`${configPath}/styles.json`));
const APPS = JSON.parse(readFile(`${configPath}/apps.json`));

export function syncConfig() {
  applySCSS();
  applyHyprland();
  applyKitty();
}

function applySCSS() {
  writeFile(
    `${HOME}/.config/ags/style/astal.scss`,
    `
    // This file is automatically generated by Astal.
    // If you want to change the colors, do so in ~/.config/ags/config/styles.json
    // Run "ags quit" then "ags run" to apply new colors.

    $transparency: ${STYLES.transparency};
    $bg: rgb(${STYLES.bg});
    $bg_trans: rgba($bg, $transparency);
    $surfaceDark: rgb(${STYLES.surface_dark});
    $surfaceDark_trans: rgba($surfaceDark, $transparency);
    $surface: rgb(${STYLES.surface});
    $surface_trans: rgba($surface, $transparency);
    $fg: rgb(${STYLES.fg});
    $fg_trans: rgba($fg, $transparency);
    $hover: rgb(${STYLES.hover});
    $hover_trans: rgba($hover, $transparency);
    $text: rgb(${STYLES.text});
    $error: rgb(${STYLES.error});

    $paddingBase: ${STYLES.paddingBase}px;
    $borderWidth: ${STYLES.borderWidth}px;
    $brv: ${STYLES.cornerRounding}px;
    $buttonSize: ${STYLES.buttonSize}px;
    `
  );
}

function applyHyprland() {
  writeFile(
    `${HOME}/.config/hypr/hyprland/astal.conf`,
    `
    # This file is automatically generated by Astal.
    # If you want to change the colors, do so in ~/.config/ags/config/styles.json
    # Run "ags quit" then "ags run" to apply new colors.

    general {
      col.active_border = rgb(${STYLES.surface})
      col.inactive_border = rgb(${STYLES.bg})

      gaps_in = ${STYLES.paddingBase / 2}
      gaps_out = ${STYLES.paddingBase}
      gaps_workspaces = 50
      border_size = ${STYLES.borderWidth}
    }

    decoration {
      rounding = ${STYLES.cornerRounding / 2}

      shadow {
        color = rgba(${STYLES.bg},0.5)
      }
    }

    plugin {
      overview {
        panelColor = rgba(${STYLES.bg},${STYLES.transparency})
        panelBorderColor = rgb(${STYLES.bg})
        workspaceActiveBorder = rgb(${STYLES.surface})
        workspaceInactiveBorder = rgb(${STYLES.bg})
      }
    }

    $terminal = ${APPS.terminal}
    $terminalAlt = ${APPS.terminalAlt}
    $webBrowser = ${APPS.webBrowser}
    $webBrowserAlt = ${APPS.webBrowserAlt}
    $fileManager = ${APPS.fileManager}
    $fileManagerAlt = ${APPS.fileManagerAlt}
    $textEditor = ${APPS.textEditor}
    $codeEditor = ${APPS.codeEditor}
    $settings = ${APPS.settings}
    $systemMonitor = ${APPS.systemMonitor}
    $volumeMixer = ${APPS.audioSettings}
    `
  );

  writeFile(
    `${HOME}/.config/hypr/hyprlock/astal.conf`,
    `$background_color = rgba(${STYLES.bg},${STYLES.transparency})
    $text_color = rgb(${STYLES.text})
    $entry_background_color = rgb(${STYLES.surface_dark})
    $entry_border_color = rgb(${STYLES.surface})
    $entry_color = rgb(${STYLES.text})
    $cornerRounding = ${STYLES.cornerRounding}
    $borderWidth = ${STYLES.borderWidth}`
  );
}

function applyKitty() {
  let kittyConf = readFile(`${HOME}/.config/kitty/kitty.conf`);
  kittyConf = kittyConf.slice(0, kittyConf.indexOf('# ASTAL') - 1);

  function convertToHex(input: any) {
    return input
      .split(',')
      .map((v: any) => {
        let int = parseInt(v);
        if (int < 16) return `0${int.toString(16)}`;
        return int.toString(16);
      })
      .join('');
  }

  kittyConf = `${kittyConf}
# ASTAL
foreground #${convertToHex(STYLES.text)}
background #${convertToHex(STYLES.bg)}

background_opacity ${STYLES.transparency}`;

  writeFile(`${HOME}/.config/kitty/kitty.conf`, kittyConf);
}
