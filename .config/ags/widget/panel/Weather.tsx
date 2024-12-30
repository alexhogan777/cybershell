// Widgets
import { PanelSection } from './PanelSection';

export const Weather = () => {
  const title = () => {
    return <label label='Weather' className='title' />;
  };

  return (
    <PanelSection section='Weather' icon='partly_cloudy_day' title={title()}>
      <box>Hello Weather!</box>
    </PanelSection>
  );
};
