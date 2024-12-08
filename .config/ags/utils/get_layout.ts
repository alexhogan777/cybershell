import { App, Astal } from 'astal/gtk3';
import { userConfig } from '../config/user_config';
const barConfig = userConfig.bar;

export function getLayout(monitorInt: number) {
  const unrendered = {
    rendered: false,
    side: '',
    anchor: Astal.WindowAnchor.NONE,
  };
  const left = {
    rendered: true,
    side: 'left',
    anchor:
      Astal.WindowAnchor.TOP |
      Astal.WindowAnchor.BOTTOM |
      Astal.WindowAnchor.LEFT,
  };
  const right = {
    rendered: true,
    side: 'right',
    anchor:
      Astal.WindowAnchor.TOP |
      Astal.WindowAnchor.BOTTOM |
      Astal.WindowAnchor.RIGHT,
  };

  switch (barConfig.displayMode) {
    case 'default': // note the quotes
      if (monitorInt === 0) return left;
      if (monitorInt === App.get_monitors().length - 1) return right;
      return unrendered;
    case 'all':
      if (barConfig.displayAnchor === 'left') return left;
      if (barConfig.displayAnchor === 'right') return right;
      return unrendered;
    default:
      //@ts-expect-error
      if (barConfig.displayMode.includes(monitorInt)) {
        if (barConfig.displayAnchor === 'left') return left;
        if (barConfig.displayAnchor === 'right') return right;
      }
      return unrendered;
  }
}
