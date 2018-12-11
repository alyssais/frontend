// @flow
/* eslint-disable react/no-render-return-value */

import React from 'react';
import ReactDOM from 'react-dom';
import { ErrorBoundary } from './Bugsnag';

export default <ElementType: React$ElementType>(
  element: React$Element<ElementType>,
  container: Element,
  callback?: () => void
) => (
  ReactDOM.render(
    <ErrorBoundary>
      {element}
    </ErrorBoundary>,
    container,
    callback
  )
);