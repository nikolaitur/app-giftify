import React, { useState, useEffect, useRef } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';
import Image from 'next/image';

// --- PARTIALS ------------------------------------------------- //
import Hamburger from '../partials/hamburger';
import Loadbars from '../partials/loadbars';
import Sidebar from '../partials/sidebar';
import GlobalStyle from '../partials/css';

// --- HELPERS -------------------------------------------------- //
import Formify from '../helpers/formify';
import X from '../helpers/x';
import Toast from '../helpers/toast';
import ColorPicker from '../helpers/color';

// --- VALIDATORS ----------------------------------------------- //
import SettingsValidator from '../validators/settings';

const Settings = () => {

  // --- INITS -------------------------------------------------- //
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const init_data = {
    settings: {}
  }
  const mount = useRef(true);

  // --- STATES ------------------------------------------------- //
  const [ loading, $_loading ] = useState(true);
  const [ updating, $_updating ] = useState(false);
  const [ tabs, $_tabs ] = useState(1);
  const [ data, $_data, $_valid, errors ] = Formify(init_data, SettingsValidator);

  // --- EFFECTS ------------------------------------------------ //
  useEffect(() => {
    async function start() {
      X(app).get('/a/settings', res => {
        $_data(res.data, true);
        $_loading(false);
        return () => { mount.current = false; }
      }, (error) => {
        $_loading(false);
        Toast(app, error, 'ERROR');
      });
    }
    start();
  }, []);

  // --- METHODS ------------------------------------------------ //
  const save = async () => {
    if ($_valid()) {
      $_updating(true);
      X(app).post('/a/settings', data, res => {
        $_updating(false);
        Toast(app, 'Settings saved');
      }, (error) => {
        $_updating(false);
        Toast(app, error, 'ERROR');
      });
    } else {
      Toast(app, 'Settings contain errors', 'ERROR');
    }
  };

  const activate = async () => {
    $_updating(true);
    window.active = !window.active
    X(app).post('/a/settings/activate', { active : window.active }, res => {
      $_updating(false);
      Toast(app, window.active ? 'Giftify activated' : 'Giftify disabled' );
    }, (error) => {
      $_updating(false);
      Toast(app, error, 'ERROR');
    });
  };

  const adminURL = (target) => {
    redirect.dispatch(Redirect.Action.ADMIN_PATH, { path: target, newContext: true });
  };

  const overlay_off = () => {
    document.getElementById('support').classList.remove('active');
  };

  // --- RENDER ------------------------------------------------- //
  return (
    <div className="inside">
      <div className="overlay" onClick={ overlay_off }></div>
        <div className="grid">
          <Sidebar view="settings" />
          <div className="main">
            <div className="grid vcenter-xs">
              <div className="col-24-xs">
                <Hamburger />
                <div className="grid vcenter-xs hspace-between-xs">
                  <h1>Settings</h1>
                  <span className="toggleSwitch">
                    <input type="checkbox" id="toggle" checked={ window.active } />
                    <label for="toggle" className="grid vcenter-xs" onClick={ activate }>
                      <span>{ window.active ? 'App is enabled' : 'App is disabled' }</span>
                      <div className="switch">
                        <div className="dot"></div>
                      </div>
                    </label>
                  </span>
                </div>
              </div>
            </div>
            { (loading) && (
              <Loadbars />
            )}
            { (!loading) && (
              <div className="tabs mt-3">
                { (data.general) && (
                  <GlobalStyle config={ data } />
                )}
                <div className="tabs-nav grid">
                  <a onClick={ () => { $_tabs(1) } } className={ `${ tabs == 1 ? 'active' : '' } ${ JSON.stringify(errors).indexOf('general.') > -1 ? 'has-errors' : '' }` }>General</a>
                  <a onClick={ () => { $_tabs(2) } } className={ tabs == 2 ? 'active' : '' }>Button</a>
                  <a onClick={ () => { $_tabs(3) } } className={ tabs == 3 ? 'active' : '' }>Popup</a>
                  <a onClick={ () => { $_tabs(4) } } className={ tabs == 4 ? 'active' : '' }>Emails</a>
                </div>  

                <div className="tab" style={{display : tabs == 1 ? 'block' : 'none' }}>
                  <div className="grid">
                    <div className="col-12-sm">
                      <div className="field">
                        <label>Store Name</label>
                        { (errors['general.name']) && (
                          <div className="error">{ errors['general.name'] }</div>
                        )}
                        <input value={ data.general.name } onChange={ $_data } name="general.name" type="text" placeholder="e.g. My Best Store" />
                      </div>
                    </div>
                    <div className="col-12-sm">
                      <div className="field">
                        <label>Store Email</label>
                        { (errors['general.email']) && (
                          <div className="error">{ errors['general.email'] }</div>
                        )}
                        <input value={ data.general.email } onChange={ $_data } name="general.email" type="email" placeholder="e.g. contact@store.com" />
                      </div>
                    </div>
                  </div>
                  <div className="grid">
                    <div className="col-12-sm">
                      <div className="field">
                        <label>Logo URL</label>
                        <small>You can use <a onClick={ () => { adminURL('/settings/files') } }>Files</a> to store your logo. Read more <a href="https://help.shopify.com/en/manual/shopify-admin/productivity-tools/file-uploads" target="_blank">here</a></small>
                        <input value={ data.general.logo } onChange={ $_data } name="general.logo" type="text" />
                      </div>
                    </div>
                    <div className="col-12-sm">
                      <div className="field">
                        <label>Logo Preview</label>
                        { (data.general.logo) && (
                          <div className="mt-3 ml-1 mw-200px"><img src={ data.general.logo } /></div>
                        )}
                        { (!data.general.logo || data.general.logo == '') && (
                          <div className="mt-3 ml-1 opacity-30"><Image src="/icons/noimage.svg" width="52" height="52" /></div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid">
                    <div className="col-24-sm">
                      <button className={ `btn ${ updating ? 'updating' : '' }` } onClick={ save }>Save</button>
                    </div>
                  </div>
                </div>

                <div className="tab" style={{display : tabs == 2 ? 'block' : 'none' }}>
                  <div className="grid">
                    <div className="order-2-xs order-1-sm col-12-sm">
                      <div className="grid">
                        <div className="col-12-sm">
                          <div className="field">
                            <label>Text</label>
                            <input value={ data.button.text } onChange={ $_data } name="button.text" type="text" placeholder="e.g. Send as a gift" />
                          </div>
                        </div>
                        <div className="col-12-sm">
                          <div className="field">
                            <label>Gift Icon</label>
                            <span className="toggleSwitch">
                              <input type="checkbox" id="toggle" checked={ data.button.icon } />
                              <label for="toggle" className="grid vcenter-xs">
                                <div className="switch empty">
                                  <div className="dot"></div>
                                </div>
                              </label>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid">
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Background Color</label>
                            <ColorPicker color={ data.button.bgColor } name="button.bgColor" onChange={ $_data } />
                          </div>
                        </div>
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Text Color</label>
                            <ColorPicker color={ data.button.txtColor } name="button.txtColor" onChange={ $_data } />
                          </div>
                        </div>
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Border Color</label>
                            <ColorPicker color={ data.button.borderColor } name="button.borderColor" onChange={ $_data } />
                          </div>
                        </div>
                      </div>
                      <div className="grid">
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Hover Background Color</label>
                            <ColorPicker color={ data.button.hoverBgColor } name="button.hoverBgColor" onChange={ $_data } />
                          </div>
                        </div>
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Hover Text Color</label>
                            <ColorPicker color={ data.button.hoverTxtColor } name="button.hoverTxtColor" onChange={ $_data } />
                          </div>
                        </div>
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Hover Border Color</label>
                            <ColorPicker color={ data.button.hoverBorderColor } name="button.hoverBorderColor" onChange={ $_data } />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="order-1-xs order-2-sm col-12-sm">
                      <div className="field">
                        <label>Button Preview</label>
                        <small>Please mind differences due to theme CSS</small>
                        <a className="giftify-button">
                          <span>
                            { (data.button.icon) && (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M 9 2 C 7.3545455 2 6 3.3545455 6 5 C 6 5.3884621 6.2790206 5.6579606 6.4160156 6 L 2 6 L 2 7 L 2 12 L 3 12 L 3 19.099609 C 3 20.132943 3.8670573 21 4.9003906 21 L 19.099609 21 C 20.132943 21 21 20.132943 21 19.099609 L 21 12 L 22 12 L 22 6 L 17.583984 6 C 17.720979 5.6579606 18 5.3884621 18 5 C 18 3.3545455 16.645455 2 15 2 C 14.084324 2 13.268996 2.4283349 12.716797 3.0839844 L 12 3.8007812 L 11.283203 3.0839844 C 10.731004 2.4283349 9.9156763 2 9 2 z M 9 4 C 9.5545455 4 10 4.4454545 10 5 C 10 5.5545455 9.5545455 6 9 6 C 8.4454545 6 8 5.5545455 8 5 C 8 4.4454545 8.4454545 4 9 4 z M 15 4 C 15.554545 4 16 4.4454545 16 5 C 16 5.5545455 15.554545 6 15 6 C 14.445455 6 14 5.5545455 14 5 C 14 4.4454545 14.445455 4 15 4 z M 4 8 L 9 8 L 15 8 L 20 8 L 20 10 L 4 10 L 4 8 z M 5 12 L 11 12 L 11 19 L 5 19 L 5 12 z M 13 12 L 19 12 L 19 19 L 13 19 L 13 12 z"/></svg>
                            )}
                            { data.button.text }
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="grid">
                    <div className="col-24-sm">
                      <button className={ `btn ${ updating ? 'updating' : '' }` } onClick={ save }>Save</button>
                      <div className="minheight"></div>
                    </div>
                  </div>
                </div>

                <div className="tab" style={{display : tabs == 3 ? 'block' : 'none' }}>
                  POP
                </div>

                <div className="tab" style={{display : tabs == 4 ? 'block' : 'none' }}>
                  EM
                </div>

              </div>
            )}
          </div>
        </div>
    </div>
  );
}

export default Settings;
