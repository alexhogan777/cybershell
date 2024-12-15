// Widgets
import { PanelSection } from './PanelSection';

export const Weather = (monitorInt: number) => {
  const title = () => {
    return <label label='Weather' className='title' />;
  };

  return (
    <PanelSection
      monitorInt={monitorInt}
      section='Weather'
      icon='partly_cloudy_day'
      title={title()}
    >
      <box>Hello Weather!</box>
    </PanelSection>
  );
};
