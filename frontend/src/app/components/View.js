import classNames from 'classnames';
import React from 'react';
import ReactDOMFactories from 'react/lib/ReactDOMFactories';
import Symbol from 'es-symbol';

import NewsletterFooter from '../components/NewsletterFooter';
import Header from '../components/Header';
import Footer from '../components/Footer';


const DOMFactories = Object.keys(ReactDOMFactories);


/**
 * Wraps common view elements (header, footer) in a wrapping component. Passes
 * all props down to all children.
 */
export default class View extends React.Component {

  isReactComponent(element) {
    /**
     * Returns a boolean indicating whether or not the passed argument is a
     * React component. This is more complicated than you might expect, because
     * actual components aren't used in tests, instead replaced with component-
     * like proxy objects.
     *
     * The second condition will only pass in tests, and only then because the
     * proxy object looks like this:
     *
     * { '$$typeof': Symbol(react.element), type: 'ComponentName' }
     *
     * or like this, if it is a DOM element:
     *
     * { '$$typeof': Symbol(react.element), type: 'div' }
     */
    return (
      React.Component.isPrototypeOf.call(React.Component, element) || (
        element.$$typeof === Symbol.for('react.element') &&
        DOMFactories.indexOf(element.type) === -1
      )
    );
  }

  renderChildren() {
    /**
     * Returns an array of this components truthy children, passing down this
     * component's props to each of them.
     */
    return React.Children.map(this.props.children, child => {
      if (!child) {
        return null;
      }

      // If the child is a component, merge its props with the View component's
      // props (except for `children`, which is special and should be fully
      // taken from the child).
      if (this.isReactComponent(child)) {
        const combinedProps = Object.assign({}, this.props, child.props);
        combinedProps.children = child.props.children;
        return React.cloneElement(child, combinedProps);
      }

      return child;
    });
  }

  renderNewsletterFooter() {
    if (this.props.showNewsletterFooter) {
      return <NewsletterFooter {...this.props} />;
    }
    return null;
  }

  renderFooter() {
    if (this.props.showFooter) {
      return <Footer {...this.props} />;
    }
    return null;
  }

  renderHeader() {
    if (this.props.showHeader) {
      return <Header {...this.props} />;
    }
    return null;
  }

  makeClassNames() {
    return classNames('view', 'full-page-wrapper', {
      centered: this.props.centered,
      'space-between': this.props.spaceBetween
    });
  }

  renderUpgradeWarning() {
    if (this.props.hasAddon === null) {
      return null;
    }
    if (typeof navigator.mozAddonManager !== 'undefined') {
      return null;
    }
    if (!this.props.isFirefox) {
      return null;
    }
    let title = <h1 className="warning">Something is wrong!</h1>;
    let copy = <p>Something has gone wrong with Test Pilot. Please <a href="https://github.com/mozilla/testpilot/issues/new">file a bug</a> and mention this error message.</p>;
    if (!this.props.isMinFirefox) {
      title = <h1 className="warning">Upgrade firefox</h1>;
      copy = <p>The version of Firefox which is installed is too old. Please upgrade.</p>;
    } else if (window.location.protocol !== 'https:') {
      title = <h1 className="warning">HTTPS required</h1>;
      copy = <p>Test Pilot must be accessed over https. Please see <a href="https://github.com/mozilla/testpilot/blob/master/docs/development/quickstart.md">the documentation</a> for details.</p>;
    } else if (['example.com:8000', 'testpilot.dev.mozaws.net', 'testpilot.stage.mozaws.net'].includes(window.location.host)) {
      title = <h1 className="warning">extensions.webapi.testing required</h1>;
      copy = <p>When testing Test Pilot locally, on the dev server, or on the staging server, the extensions.webapi.testing preference is required. Please see <a href="https://github.com/mozilla/testpilot/blob/master/docs/development/quickstart.md">the documentation</a> for details.</p>;
    } else if (window.location.host !== 'testpilot.firefox.com') {
      title = <h1 className="warning">Unapproved hostname</h1>;
      copy = <p>The Test Pilot site may only be accessed from testpilot.firefox.com, testpilot.stage.mozaws.net, testpilot.dev.mozaws.net, or example.com:8000. Please see <a href="https://github.com/mozilla/testpilot/blob/master/docs/development/quickstart.md">the documentation</a> for details.</p>;
    }
    return <div className="banner banner-expanded">
      <div className="layout-wrapper layout-wrapper--row-between-reverse">
        <div className="intro-text">
          <h2 className="banner__title">{title}</h2>
          <p className="banner__copy">{copy}</p>
        </div>
      </div>
    </div>;
  }

  render() {
    const upgradeWarning = this.renderUpgradeWarning();
    return (
      <section className={this.makeClassNames()}>
        {this.renderHeader()}
        {upgradeWarning !== null ? upgradeWarning : this.renderChildren()}
        {upgradeWarning !== null ? null : this.renderNewsletterFooter()}
        {this.renderFooter()}
      </section>
    );
  }

}

View.defaultProps = {
  centered: false,
  showNewsletterFooter: true,
  showFooter: true,
  showHeader: true,
  spaceBetween: false
};

// TODO Implement FlowTypes for View

// View.propTypes = {
//
//   /**
//    * If true, adds the `centered` class to the wrapper. Default: `false`.
//    */
//   centered: PropTypes.bool.isRequired,
//
//   /**
//    * If true, renders a newsletter subscription form above the footer
//    * component. Default: `true`.
//    */
//   showNewsletterFooter: PropTypes.bool.isRequired,
//
//   /**
//    * If true, renders the `<Footer>` component. Default: `true`.
//    */
//   showFooter: PropTypes.bool.isRequired,
//
//   /**
//    * If true, renders the `<Header>` component. Default: `true`.
//    */
//   showHeader: PropTypes.bool.isRequired,
//
//   /**
//    * If true, adds the `space-between` class to the wrapper. Default: `false`.
//    */
//   spaceBetween: PropTypes.bool.isRequired
//
// };
