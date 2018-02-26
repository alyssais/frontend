// @flow
/* eslint-disable react/prop-types */

import React from "react";
import Loadable from "react-loadable";

import Spinner from "../../shared/Spinner";
import { fetchAndBuildGraphQLSchema, getGraphQLSchema } from "./schema";

type CodeMirrorInstance = {
  showHint: ({}) => void,
  on: (string, (any) => void) => mixed,
  off: (string, (any) => void) => mixed,
  getValue: () => string,
  execCommand: (string) => void
}

type Props = {
  value?: string,
  onChange: (string) => void
};

type LoadedProps = {
  CodeMirror: {
    fromTextArea: (HTMLTextAreaElement, {}) => CodeMirrorInstance
  }
};

type ReactLoadableLoadingProps = {
  error?: string,
  pastDelay?: boolean
};

const AUTO_COMPLETE_AFTER_KEY = /^[a-zA-Z0-9_@(]$/;

class GraphQLExplorerConsoleEditor extends React.PureComponent<Props & LoadedProps> {
  codeMirrorInstance: ?CodeMirrorInstance
  textAreaElement: ?HTMLTextAreaElement

  componentDidMount() {
    if (this.textAreaElement) {
      const schema = getGraphQLSchema();

      this.codeMirrorInstance = this.props.CodeMirror.fromTextArea(
        this.textAreaElement,
        {
          lineNumbers: true,
          tabSize: 2,
          mode: 'graphql',
          keyMap: 'sublime',
          autoCloseBrackets: true,
          matchBrackets: true,
          showCursorWhenSelecting: true,
          viewportMargin: Infinity,
          gutters: ['CodeMirror-linenumbers'],
          theme: "graphql",
          extraKeys: {
            'Cmd-Space': () => this.codeMirrorInstance && this.codeMirrorInstance.showHint({ completeSingle: true }),
            'Ctrl-Space': () => this.codeMirrorInstance && this.codeMirrorInstance.showHint({ completeSingle: true }),
            'Alt-Space': () => this.codeMirrorInstance && this.codeMirrorInstance.showHint({ completeSingle: true }),
            'Shift-Space': () => this.codeMirrorInstance && this.codeMirrorInstance.showHint({ completeSingle: true }),
            'Cmd-Enter': () => {
              this.executeCurrentQuery();
            },
            'Ctrl-Enter': () => {
              this.executeCurrentQuery();
            },
            // Persistent search box in Query Editor
            'Cmd-F': 'findPersistent',
            'Ctrl-F': 'findPersistent',
            // Editor improvements
            'Ctrl-Left': 'goSubwordLeft',
            'Ctrl-Right': 'goSubwordRight',
            'Alt-Left': 'goGroupLeft',
            'Alt-Right': 'goGroupRight'
          },
          lint: {
            schema: schema
          },
          hintOptions: {
            schema: schema,
            closeOnUnfocus: false,
            completeSingle: false
          }
        }
      );

      if (this.codeMirrorInstance) {
        this.codeMirrorInstance.on("change", this.onEditorChange);
        this.codeMirrorInstance.on("keyup", this.onEditorKeyUp);
      }
    }
  }

  componentWillUnmount() {
    if (this.codeMirrorInstance) {
      this.codeMirrorInstance.off("change", this.onEditorChange);
      this.codeMirrorInstance.off("keyup", this.onEditorKeyUp);
      this.codeMirrorInstance = null;
    }
  }

  render() {
    return (
      <div>
        <textarea
          defaultValue={this.props.value}
          ref={(input) => this.textAreaElement = input}
        />
      </div>
    );
  }

  onEditorChange = () => {
    if (this.codeMirrorInstance) {
      this.props.onChange(this.codeMirrorInstance.getValue());
    }
  };

  onEditorKeyUp = (event) => {
    if (AUTO_COMPLETE_AFTER_KEY.test(event.key)) {
      if (this.codeMirrorInstance) {
        this.codeMirrorInstance.execCommand('autocomplete');
      }
    }
  };
}

// Instead of exporting the editor directly, we'll export a `Loadable`
// Component that will allow us to load in dependencies and render the editor
// until then.
export default Loadable.Map({
  loader: {
    CodeMirror: () => (
      import('./codemirror').then((module) => (
        // Add a "zero" delay after the module has loaded, to allow their
        // styles to take effect.
        new Promise((resolve) => {
          setTimeout(() => resolve(module.default), 0);
        })
      ))
    ),
    // Load in the GraphQL schema at the same time
    graaphQLSchema: () => {
      return fetchAndBuildGraphQLSchema();
    }
  },

  loading(props: ReactLoadableLoadingProps) {
    if (props.error) {
      return (
        <div>{props.error}</div>
      );
    } else if (props.pastDelay) {
      return (
        <div className="flex items-center justify-center" style={{ height: 500 }}>
          <Spinner /> Loading GraphQL Editor…
        </div>
      );
    }

    return null;
  },

  render(loaded: LoadedProps, props: Props) {
    return (
      <GraphQLExplorerConsoleEditor
        CodeMirror={loaded.CodeMirror}
        value={props.value}
        onChange={props.onChange}
      />
    );
  }
});
