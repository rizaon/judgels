import * as React from 'react';

import { JUDGELS_VERSION } from 'version';

import './Footer.css';

export const Footer = () => (
  <div className="footer">
    <hr />
    <div className="footer__text">
      <div className="footer__left">&copy; 2018 Ikatan Alumni TOKI</div>
      <div className="footer__right">
        Powered by <a href="https://github.com/ia-toki/judgels">Judgels</a> {JUDGELS_VERSION}
      </div>
    </div>
  </div>
);
