import React, { PropTypes } from 'react';

export default class Warning extends React.Component {
  renderSubtitle() {
    if (this.props.subtitle) {
      return (
        <p data-l10n-id={this.props.subtitleL10nId}>{this.props.subtitle}</p>
      );
    }
    return null;
  }

  renderHeader() {
    if (this.props.title) {
      return (
        <header>
          <h3 data-l10n-id={this.props.titleL10nId}>{this.props.title}</h3>
          {this.renderSubtitle()}
        </header>
      );
    }
    return null;
  }

  render() {
    return (
      <section className="warning">
        {this.renderHeader()}
        {this.props.children}
      </section>
    );
  }
}

Warning.propTypes = {
  title: PropTypes.string,
  titleL10nId: PropTypes.string,
  subtitle: PropTypes.string,
  subtitleL10nId: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ])
};
