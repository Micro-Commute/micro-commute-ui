import React from 'react';
import SimpleLocationRouteInputForm from './SimpleLocationRouteInputForm';
import { fn } from '@storybook/test';

export default {
  title: 'Components/SimpleLocationRouteInputForm',
  component: SimpleLocationRouteInputForm,
  tags: ['autodocs'],
};

export const Default = {
  args: {
    onStartingPointChange: fn(),
    onDestinationChange: fn(),
  },
};

