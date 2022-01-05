import React, { useState, useEffect, useRef } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';

// --- PARTIALS ------------------------------------------------- //
import Hamburger from '../partials/hamburger';
import Loadbars from '../partials/loadbars';
import Sidebar from '../partials/sidebar';

// --- HELPERS -------------------------------------------------- //
import Formify from '../helpers/formify';
import X from '../helpers/x';
import Toast from '../helpers/toast';

// --- VALIDATORS ----------------------------------------------- //
import SettingsValidator from '../validators/settings';

const Settings = () => {

  // --- INITS -------------------------------------------------- //
  const app = useAppBridge();
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
        $_data(res.data);
        $_loading(false);
        return () => { mount.current = false; }
      }, (error) => {
        $_loading(false);
        Toast(app, error, 'ERROR');
      });
    }
    start();
  }, []);

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
                    <label for="toggle" className="grid vcenter-xs">
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
                  <a onClick={ () => { $_tabs(1) } } className={ tabs == 1 ? 'active' : '' }>General</a>
                  <a onClick={ () => { $_tabs(2) } } className={ tabs == 2 ? 'active' : '' }>Popup</a>
                  <a onClick={ () => { $_tabs(3) } } className={ tabs == 3 ? 'active' : '' }>Emails</a>
                </div>  

                <div className="tab" style={{display : tabs == 1 ? 'block' : 'none' }}>
                  <div className="grid">
                    <div className="col-24-xs">
                      <div className="field">
                        <label>Store Name</label>
                        { (errors['info.name']) && (
                          <div className="error">{ errors['info.name'] }</div>
                        )}
                        <input value={ data.info.name } onChange={ $_data } name="info.name" type="text" placeholder="e.g. My Best Store" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tab" style={{display : tabs == 2 ? 'block' : 'none' }}>
                  POP
                </div>

                <div className="tab" style={{display : tabs == 3 ? 'block' : 'none' }}>
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
