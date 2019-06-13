// @flow

// #region imports
import loadable from 'loadable-components';
// #endregion

export const Home = loadable(() => import('../pages/home/home'));
export const login = loadable(() => import('../pages/login/login'));
 