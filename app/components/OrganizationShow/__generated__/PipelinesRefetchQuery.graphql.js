/**
 * @flow
 * @relayHash 94eea37cd76d2319d09818a129414032
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type Pipelines_organization$ref = any;
export type PipelinesRefetchQueryVariables = {|
  organizationSlug: string,
  teamSearch?: ?any,
  includeGraphData: boolean,
  pageSize: number,
  pipelineFilter?: ?string,
|};
export type PipelinesRefetchQueryResponse = {|
  +organization: ?{|
    +$fragmentRefs: Pipelines_organization$ref
  |}
|};
export type PipelinesRefetchQuery = {|
  variables: PipelinesRefetchQueryVariables,
  response: PipelinesRefetchQueryResponse,
|};
*/


/*
query PipelinesRefetchQuery(
  $organizationSlug: ID!
  $teamSearch: TeamSelector
  $includeGraphData: Boolean!
  $pageSize: Int!
  $pipelineFilter: String
) {
  organization(slug: $organizationSlug) {
    ...Pipelines_organization_1JDUSM
    id
  }
}

fragment Pipelines_organization_1JDUSM on Organization {
  ...Welcome_organization
  id
  slug
  allPipelines: pipelines(team: $teamSearch) {
    count
  }
  pipelines(search: $pipelineFilter, first: $pageSize, team: $teamSearch, order: NAME_WITH_FAVORITES_FIRST) {
    ...ShowMoreFooter_connection
    edges {
      node {
        id
        name
        description
        favorite
        ...Pipeline_pipeline_77nm2
      }
    }
  }
}

fragment Welcome_organization on Organization {
  slug
  permissions {
    pipelineCreate {
      code
      allowed
      message
    }
  }
}

fragment ShowMoreFooter_connection on Connection {
  pageInfo {
    hasNextPage
  }
}

fragment Pipeline_pipeline_77nm2 on Pipeline {
  ...Status_pipeline
  ...Metrics_pipeline
  ...Graph_pipeline_77nm2
  id
  name
  slug
  description
  defaultBranch
  url
  favorite
  permissions {
    pipelineFavorite {
      allowed
    }
  }
}

fragment Status_pipeline on Pipeline {
  id
  firstBuild: builds(first: 1, branch: "%default", state: [RUNNING, CANCELING, PASSED, FAILED, CANCELED, BLOCKED]) {
    edges {
      node {
        state
        url
        ...BuildTooltip_build
        id
      }
    }
  }
}

fragment Metrics_pipeline on Pipeline {
  metrics(first: 6) {
    edges {
      node {
        label
        ...Metric_metric
        id
      }
    }
  }
}

fragment Graph_pipeline_77nm2 on Pipeline {
  builds(first: 30, branch: "%default", state: [SCHEDULED, RUNNING, PASSED, FAILED, CANCELED, CANCELING, BLOCKED]) @include(if: $includeGraphData) {
    edges {
      node {
        id
        state
        url
        startedAt
        finishedAt
        canceledAt
        scheduledAt
        ...Bar_build
      }
    }
  }
}

fragment Bar_build on Build {
  ...BuildTooltip_build
}

fragment BuildTooltip_build on Build {
  message
  url
  commit
  state
  startedAt
  finishedAt
  canceledAt
  scheduledAt
  createdBy {
    __typename
    ... on User {
      name
      avatar {
        url
      }
    }
    ... on UnregisteredUser {
      name
      avatar {
        url
      }
    }
    ... on Node {
      id
    }
  }
}

fragment Metric_metric on PipelineMetric {
  label
  value
  url
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "organizationSlug",
    "type": "ID!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "teamSearch",
    "type": "TeamSelector",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "includeGraphData",
    "type": "Boolean!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "pageSize",
    "type": "Int!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "pipelineFilter",
    "type": "String",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "slug",
    "variableName": "organizationSlug",
    "type": "ID!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "allowed",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "message",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "Variable",
  "name": "team",
  "variableName": "teamSearch",
  "type": "TeamSelector"
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "Literal",
  "name": "branch",
  "value": "%default",
  "type": "[String!]"
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "state",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "commit",
  "args": null,
  "storageKey": null
},
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "startedAt",
  "args": null,
  "storageKey": null
},
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "finishedAt",
  "args": null,
  "storageKey": null
},
v13 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "canceledAt",
  "args": null,
  "storageKey": null
},
v14 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "scheduledAt",
  "args": null,
  "storageKey": null
},
v15 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v16 = [
  v15,
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "avatar",
    "storageKey": null,
    "args": null,
    "concreteType": "Avatar",
    "plural": false,
    "selections": [
      v7
    ]
  }
],
v17 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "createdBy",
  "storageKey": null,
  "args": null,
  "concreteType": null,
  "plural": false,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "__typename",
      "args": null,
      "storageKey": null
    },
    v5,
    {
      "kind": "InlineFragment",
      "type": "UnregisteredUser",
      "selections": v16
    },
    {
      "kind": "InlineFragment",
      "type": "User",
      "selections": v16
    }
  ]
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "PipelinesRefetchQuery",
  "id": null,
  "text": "query PipelinesRefetchQuery(\n  $organizationSlug: ID!\n  $teamSearch: TeamSelector\n  $includeGraphData: Boolean!\n  $pageSize: Int!\n  $pipelineFilter: String\n) {\n  organization(slug: $organizationSlug) {\n    ...Pipelines_organization_1JDUSM\n    id\n  }\n}\n\nfragment Pipelines_organization_1JDUSM on Organization {\n  ...Welcome_organization\n  id\n  slug\n  allPipelines: pipelines(team: $teamSearch) {\n    count\n  }\n  pipelines(search: $pipelineFilter, first: $pageSize, team: $teamSearch, order: NAME_WITH_FAVORITES_FIRST) {\n    ...ShowMoreFooter_connection\n    edges {\n      node {\n        id\n        name\n        description\n        favorite\n        ...Pipeline_pipeline_77nm2\n      }\n    }\n  }\n}\n\nfragment Welcome_organization on Organization {\n  slug\n  permissions {\n    pipelineCreate {\n      code\n      allowed\n      message\n    }\n  }\n}\n\nfragment ShowMoreFooter_connection on Connection {\n  pageInfo {\n    hasNextPage\n  }\n}\n\nfragment Pipeline_pipeline_77nm2 on Pipeline {\n  ...Status_pipeline\n  ...Metrics_pipeline\n  ...Graph_pipeline_77nm2\n  id\n  name\n  slug\n  description\n  defaultBranch\n  url\n  favorite\n  permissions {\n    pipelineFavorite {\n      allowed\n    }\n  }\n}\n\nfragment Status_pipeline on Pipeline {\n  id\n  firstBuild: builds(first: 1, branch: \"%default\", state: [RUNNING, CANCELING, PASSED, FAILED, CANCELED, BLOCKED]) {\n    edges {\n      node {\n        state\n        url\n        ...BuildTooltip_build\n        id\n      }\n    }\n  }\n}\n\nfragment Metrics_pipeline on Pipeline {\n  metrics(first: 6) {\n    edges {\n      node {\n        label\n        ...Metric_metric\n        id\n      }\n    }\n  }\n}\n\nfragment Graph_pipeline_77nm2 on Pipeline {\n  builds(first: 30, branch: \"%default\", state: [SCHEDULED, RUNNING, PASSED, FAILED, CANCELED, CANCELING, BLOCKED]) @include(if: $includeGraphData) {\n    edges {\n      node {\n        id\n        state\n        url\n        startedAt\n        finishedAt\n        canceledAt\n        scheduledAt\n        ...Bar_build\n      }\n    }\n  }\n}\n\nfragment Bar_build on Build {\n  ...BuildTooltip_build\n}\n\nfragment BuildTooltip_build on Build {\n  message\n  url\n  commit\n  state\n  startedAt\n  finishedAt\n  canceledAt\n  scheduledAt\n  createdBy {\n    __typename\n    ... on User {\n      name\n      avatar {\n        url\n      }\n    }\n    ... on UnregisteredUser {\n      name\n      avatar {\n        url\n      }\n    }\n    ... on Node {\n      id\n    }\n  }\n}\n\nfragment Metric_metric on PipelineMetric {\n  label\n  value\n  url\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "PipelinesRefetchQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "organization",
        "storageKey": null,
        "args": v1,
        "concreteType": "Organization",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Pipelines_organization",
            "args": [
              {
                "kind": "Variable",
                "name": "includeGraphData",
                "variableName": "includeGraphData",
                "type": null
              },
              {
                "kind": "Variable",
                "name": "pageSize",
                "variableName": "pageSize",
                "type": null
              },
              {
                "kind": "Variable",
                "name": "pipelineFilter",
                "variableName": "pipelineFilter",
                "type": null
              },
              {
                "kind": "Variable",
                "name": "teamSearch",
                "variableName": "teamSearch",
                "type": null
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "PipelinesRefetchQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "organization",
        "storageKey": null,
        "args": v1,
        "concreteType": "Organization",
        "plural": false,
        "selections": [
          v2,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "permissions",
            "storageKey": null,
            "args": null,
            "concreteType": "OrganizationPermissions",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "pipelineCreate",
                "storageKey": null,
                "args": null,
                "concreteType": "Permission",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "code",
                    "args": null,
                    "storageKey": null
                  },
                  v3,
                  v4
                ]
              }
            ]
          },
          v5,
          {
            "kind": "LinkedField",
            "alias": "allPipelines",
            "name": "pipelines",
            "storageKey": null,
            "args": [
              v6
            ],
            "concreteType": "PipelineConnection",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "count",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "pipelines",
            "storageKey": null,
            "args": [
              {
                "kind": "Variable",
                "name": "first",
                "variableName": "pageSize",
                "type": "Int"
              },
              {
                "kind": "Literal",
                "name": "order",
                "value": "NAME_WITH_FAVORITES_FIRST",
                "type": "PipelineOrders"
              },
              {
                "kind": "Variable",
                "name": "search",
                "variableName": "pipelineFilter",
                "type": "String"
              },
              v6
            ],
            "concreteType": "PipelineConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "pageInfo",
                "storageKey": null,
                "args": null,
                "concreteType": "PageInfo",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "hasNextPage",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "PipelineEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Pipeline",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "metrics",
                        "storageKey": "metrics(first:6)",
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "first",
                            "value": 6,
                            "type": "Int"
                          }
                        ],
                        "concreteType": "PipelineMetricConnection",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "edges",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "PipelineMetricEdge",
                            "plural": true,
                            "selections": [
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "node",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "PipelineMetric",
                                "plural": false,
                                "selections": [
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "label",
                                    "args": null,
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "value",
                                    "args": null,
                                    "storageKey": null
                                  },
                                  v7,
                                  v5
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      v5,
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "description",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "favorite",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": "firstBuild",
                        "name": "builds",
                        "storageKey": "builds(branch:\"%default\",first:1,state:[\"RUNNING\",\"CANCELING\",\"PASSED\",\"FAILED\",\"CANCELED\",\"BLOCKED\"])",
                        "args": [
                          v8,
                          {
                            "kind": "Literal",
                            "name": "first",
                            "value": 1,
                            "type": "Int"
                          },
                          {
                            "kind": "Literal",
                            "name": "state",
                            "value": [
                              "RUNNING",
                              "CANCELING",
                              "PASSED",
                              "FAILED",
                              "CANCELED",
                              "BLOCKED"
                            ],
                            "type": "[BuildStates!]"
                          }
                        ],
                        "concreteType": "BuildConnection",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "edges",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "BuildEdge",
                            "plural": true,
                            "selections": [
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "node",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "Build",
                                "plural": false,
                                "selections": [
                                  v9,
                                  v7,
                                  v4,
                                  v10,
                                  v11,
                                  v12,
                                  v13,
                                  v14,
                                  v17,
                                  v5
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      v15,
                      v7,
                      v2,
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "defaultBranch",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "permissions",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "PipelinePermissions",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "pipelineFavorite",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Permission",
                            "plural": false,
                            "selections": [
                              v3
                            ]
                          }
                        ]
                      },
                      {
                        "kind": "Condition",
                        "passingValue": true,
                        "condition": "includeGraphData",
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "builds",
                            "storageKey": "builds(branch:\"%default\",first:30,state:[\"SCHEDULED\",\"RUNNING\",\"PASSED\",\"FAILED\",\"CANCELED\",\"CANCELING\",\"BLOCKED\"])",
                            "args": [
                              v8,
                              {
                                "kind": "Literal",
                                "name": "first",
                                "value": 30,
                                "type": "Int"
                              },
                              {
                                "kind": "Literal",
                                "name": "state",
                                "value": [
                                  "SCHEDULED",
                                  "RUNNING",
                                  "PASSED",
                                  "FAILED",
                                  "CANCELED",
                                  "CANCELING",
                                  "BLOCKED"
                                ],
                                "type": "[BuildStates!]"
                              }
                            ],
                            "concreteType": "BuildConnection",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "edges",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "BuildEdge",
                                "plural": true,
                                "selections": [
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "node",
                                    "storageKey": null,
                                    "args": null,
                                    "concreteType": "Build",
                                    "plural": false,
                                    "selections": [
                                      v5,
                                      v9,
                                      v7,
                                      v11,
                                      v12,
                                      v13,
                                      v14,
                                      v4,
                                      v10,
                                      v17
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'e361e057504e64d89462b9e4f7e57b42';
module.exports = node;