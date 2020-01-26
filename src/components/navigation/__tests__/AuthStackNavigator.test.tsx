import 'react-native';

import React, { ReactElement } from 'react';
import {
  act,
  render,
  wait,
} from '@testing-library/react-native';
import { createTestElement, createTestProps } from '../../../../test/testUtils';

import { NavigationNativeContainer } from '@react-navigation/native';
import StackNavigator from '../AuthStackNavigator';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let props: any;
let component: ReactElement;

describe('[Stack] navigator', () => {
  beforeEach(() => {
    props = createTestProps();
    component = createTestElement(
      <NavigationNativeContainer>
        <StackNavigator {...props} />
      </NavigationNativeContainer>,
    );
  });

  it('should renders without crashing', async () => {
    const { container } = render(component);
    await act(() => wait());
    expect(container).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
