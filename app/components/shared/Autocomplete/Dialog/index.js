/* @flow */
import React from 'react';

import Dialog from 'app/components/shared/Dialog';
import SearchField from 'app/components/shared/SearchField';
import Suggestion from './suggestion';
import ErrorMessage from 'app/components/shared/Autocomplete/error-message';
import Loader from 'app/components/shared/Autocomplete/loader';

type Props = {
  isOpen: boolean,
  onRequestClose: Function,
  width?: number,
  onSelect: Function,
  onSearch: Function,
  placeholder?: string,
  selectLabel?: string,
  items?: Array<any>
};

class AutocompleteDialog extends React.PureComponent {
  props: Props;

  state = {
    searching: false
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.items && this.state.searching) {
      // We can turn off searching now since we've got some items
      this.setState({ searching: false });
    }
  }

  isNonSuggestionComponent(node) {
    return node && node.type && (node.type.displayName === ErrorMessage.displayName || node.type.displayName === Loader.displayName);
  }

  render() {
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
        width={this.props.width}
      >
        <div className="px4 pt4 pb3">
          <SearchField
            onChange={this.handleSearchChange}
            onKeyDown={this.handleKeyDown}
            placeholder={this.props.placeholder}
            searching={this.state.searching}
            autofocus={true}
          />
        </div>
        <hr className="m0 bg-gray border-none height-0" style={{ height: 1 }} />
        {this.renderSuggestions()}
      </Dialog>
    );
  }

  renderSuggestions() {
    const items = this.props.items;

    // Insert a seperator between each section
    const suggestions = [];
    let key = 0;
    for (let index = 0, length = items.length; index < length; index++) {
      if (this.isNonSuggestionComponent(items[index])) {
        suggestions.push(
          <div key={key += 1} className="px3 py2 center">
            {items[index]}
          </div>
        );
      } else {
        suggestions.push(
          <Suggestion
            key={key += 1}
            className="rounded"
            suggestion={items[index][1]}
            onSelect={this.handleSuggestionSelection}
            selectLabel={this.props.selectLabel}
          >
            {items[index][0]}
          </Suggestion>
        );

        suggestions.push(<hr key={key += 1} className="p0 m0 bg-gray" style={{ border: "none", height: 1 }} />);
      }
    }

    return (
      <div className="block" style={{ width: "100%", maxHeight: 250, height: '50vh', overflow: 'auto' }}>
        <ul className="list-reset m0 p0">
          {suggestions}
        </ul>
      </div>
    );
  }

  handleSuggestionSelection = (suggestion) => {
    this.props.onSelect(suggestion);
    this.props.onRequestClose();
  };

  handleSearchChange = (value) => {
    this.props.onSearch(value);
    this.setState({ searching: true });
  };
}

AutocompleteDialog.ErrorMessage = ErrorMessage;
AutocompleteDialog.Loader = Loader;

export default AutocompleteDialog;
