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
// import { executeCCR } from '../common/click_close_region';
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
  const layout = Variable(getLayout(panel.monitor))
    .observe(panel, 'updated', () => getLayout(panel.monitor))
    .observe(config.bar, 'updated', () => getLayout(panel.monitor));

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

  function getMargin(side: string) {
    return layout.get().side === side ? 0 : spacing.get();
  }
  const marginLeft = Variable(getMargin('right'))
    .observe(config.appearance, 'updated', () => getMargin('right'))
    .observe(panel, 'updated', () => getMargin('right'))
    .observe(config.bar, 'updated', () => getMargin('right'));

  const marginRight = Variable(getMargin('left'))
    .observe(config.appearance, 'updated', () => getMargin('left'))
    .observe(panel, 'updated', () => getMargin('left'))
    .observe(config.bar, 'updated', () => getMargin('left'));

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
        if (keyval === 65307) panel.togglePanel(panel.monitor, 'keybind');
        if (keyval === 65362) changeSearchItemSelection(-1);
        if (keyval === 65364) changeSearchItemSelection(+1);
        if (keyval === 65293) executeSelectedSearchItem();
      }}
      margin={spacing}
      marginLeft={bind(marginLeft)}
      marginRight={bind(marginRight)}
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
