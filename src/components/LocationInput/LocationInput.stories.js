import React from 'react';
import LocationInput from './LocationInput';

export default {
  title: 'Components/LocationInput',
  component: LocationInput,
};

const Template = (args) => <LocationInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  onLocationChange: (location) => {
    console.log('Location changed:', location);
  },
};

