import React, { useState, useEffect, useRef } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';

// --- PARTIALS ------------------------------------------------- //
import Hamburger from '../partials/hamburger';
import Loadbars from '../partials/loadbars';
import Sidebar from '../partials/sidebar';

// --- HELPERS -------------------------------------------------- //
import X from '../helpers/x';
import Toast from '../helpers/toast';

const Settings = () => {

  // --- INITS -------------------------------------------------- //
  const app = useAppBridge();
  const mount = useRef(true);

  // --- STATES ------------------------------------------------- //
  const [ loading, $_loading ] = useState(true);
  const [ settings, $_settings ] = useState([]);
  const [ updating, $_updating ] = useState(false);
  const [ tabs, $_tabs ] = useState(1);

  // --- EFFECTS ------------------------------------------------ //
  useEffect(() => {
    async function start() {
      X(app).get('/a/settings', res => {
        $_settings(res.settings);
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
              <>
                
              </>
            )}
          </div>
        </div>
    </div>
  );
}

export default Settings;
