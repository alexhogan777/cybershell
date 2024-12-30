// Astal
import { App, Astal } from 'astal/gtk3';

// Config
import Bar from '../state/config/bar';
const barConfig = Bar.get_default();

export function getLayout(monitorInt: number) {
  const unrendered = {
    rendered: false,
    side: '',
    direction: '',
    anchor: Astal.WindowAnchor.NONE,
  };
  const top = {
    rendered: true,
    side: 'top',
    direction: 'horizontal',
    anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT,
  };
  const right = {
    rendered: true,
    side: 'right',
    direction: 'vertical',
    anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT,
  };
  const bottom = {
    rendered: true,
    side: 'bottom',
    direction: 'horizontal',
    anchor: Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT,
  };
  const left = {
    rendered: true,
    side: 'left',
    direction: 'vertical',
    anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT,
  };

  switch (barConfig.displayMode) {
    case 'default': // note the quotes
      if (monitorInt === 0) return left;
      if (monitorInt === App.get_monitors().length - 1) return right;
      return unrendered;
    case 'all':
      if (barConfig.displayAnchor === 'top') return top;
      if (barConfig.displayAnchor === 'right') return right;
      if (barConfig.displayAnchor === 'bottom') return bottom;
      if (barConfig.displayAnchor === 'left') return left;
      return unrendered;
    default:
      if (barConfig.displayMode.includes(monitorInt)) {
        if (barConfig.displayAnchor === 'top') return top;
        if (barConfig.displayAnchor === 'right') return right;
        if (barConfig.displayAnchor === 'bottom') return bottom;
        if (barConfig.displayAnchor === 'left') return left;
      }
      return unrendered;
  }
}
