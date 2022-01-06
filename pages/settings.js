import React, { useState, useEffect, useRef } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';
import Image from 'next/image';

// --- PARTIALS ------------------------------------------------- //
import Hamburger from '../partials/hamburger';
import Loadbars from '../partials/loadbars';
import Sidebar from '../partials/sidebar';

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
    settings: {},
    info: {}
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
                            <label>Background Color</label>
                            <ColorPicker />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="order-1-xs order-2-sm col-12-sm">
                      <div className="field">
                        <label>Button Preview</label>
                        <small>Please mind differences due to theme CSS</small>
                      </div>
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
