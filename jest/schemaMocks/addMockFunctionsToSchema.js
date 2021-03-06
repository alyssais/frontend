// @flow weak

import { addMockFunctionsToSchema } from 'graphql-tools';
import DefaultMocks from './DefaultMocks';

export default function(schema, mocks) {
  addMockFunctionsToSchema({
    schema,
    mocks: {
      ID: DefaultMocks.ID,
      String: DefaultMocks.String,
      DateTime: DefaultMocks.DateTime,

      ...mocks
    }
  });
}
