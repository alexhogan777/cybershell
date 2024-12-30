// Astal
import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { bind, Variable } from 'astal';

// Libraries
import PanelLib from '../../state/panel/panel';
const panel = PanelLib.get_default();

// Config
import { assetsPath } from '../../config/user_config';
import Config from '../../state/config/config';
const config = Config.get_default();
const spacing = bind(
  Variable(config.appearance.paddingBase).observe(
    config.appearance,
    'updated',
    () => config.appearance.paddingBase
  )
);

// Functions
import { executeCCR } from '../common/click_close_region';
import { getLayout } from '../../utils/get_layout';
import { changeSearchItemSelection, executeSelectedSearchItem } from './Search/functions';

// Widgets
import { Calendar } from './Calendar';
import { Media } from './Media';
import { Notifications } from './Notifications/main';
import { Search } from './Search/main';
import { Settings } from './Settings/main';
import { Weather } from './Weather';

export const Panel = (gdkMonitor: Gdk.Monitor) => {
  const monitorInt = App.get_monitors().indexOf(gdkMonitor);
  const layout = Variable(getLayout(monitorInt)).observe(config.bar, 'updated', () =>
    getLayout(monitorInt)
  );

  function getAnchor() {
    const _layout = layout.get();
    const _anchor = panel.anchor;
    if (_layout.direction === 'horizontal') {
      return _anchor | Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM;
    } else return _layout.anchor;
  }
  const anchor = Variable(getAnchor())
    .observe(panel, 'updated', () => getAnchor())
    .observe(config.bar, 'updated', () => getAnchor());

  return (
    <window
      monitor={bind(panel, 'monitor')}
      name={`Panel`}
      className='Panel'
      anchor={bind(anchor)}
      keymode={Astal.Keymode.EXCLUSIVE}
      layer={Astal.Layer.OVERLAY}
      onKeyPressEvent={(_, event) => {
        const keyval = event.get_keyval()[1];
        if (keyval === 65307) executeCCR();
        if (keyval === 65362) changeSearchItemSelection(-1);
        if (keyval === 65364) changeSearchItemSelection(+1);
        if (keyval === 65293) executeSelectedSearchItem();
      }}
      margin={spacing}
      marginLeft={bind(panel, 'anchor').as((a) =>
        a === Astal.WindowAnchor.RIGHT ? 0 : spacing.get()
      )}
      marginRight={bind(panel, 'anchor').as((a) =>
        a === Astal.WindowAnchor.LEFT ? 0 : spacing.get()
      )}
      application={App}
      visible={bind(panel, 'visible')}
      css={`
        background-image: url('${assetsPath}/endeavouros.png');
      `}
    >
      <scrollable propagateNaturalHeight hscroll={Gtk.PolicyType.NEVER}>
        <box vertical className='panel-container' spacing={spacing}>
          {Search()}
          {Media()}
          {Notifications()}
          {/* {Weather()} */}
          {/* {Calendar()} */}
          {Settings()}
        </box>
      </scrollable>
    </window>
  );
};
