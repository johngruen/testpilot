import { handleActions } from 'redux-actions';
import config from '../config';
import { isMinFirefoxVersion } from '../lib/utils';

const userAgent = navigator.userAgent.toLowerCase();
const isUserAgentFirefox = userAgent.indexOf('firefox') > -1;
const isUserAgentMinFirefox = isMinFirefoxVersion(isUserAgentFirefox, userAgent, config.minFirefoxVersion);
const locale = (navigator.language || '').split('-')[0];

export default handleActions({}, {
  isFirefox: isUserAgentFirefox,
  isMinFirefox: isUserAgentMinFirefox,
  isDev: config.isDev,
  locale
});
