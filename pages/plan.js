import React, { useState, useEffect, useRef } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';

// --- PARTIALS ------------------------------------------------- //
import Hamburger from '../partials/hamburger';
import Loadbars from '../partials/loadbars';
import Sidebar from '../partials/sidebar';

// --- HELPERS -------------------------------------------------- //
import X from '../helpers/x';
import Toast from '../helpers/toast';

const Plan = () => {

  // --- INITS -------------------------------------------------- //
  const app = useAppBridge();
  const mount = useRef(true);

  // --- STATES ------------------------------------------------- //
  const [ loading, $_loading ] = useState(true);
  const [ items, $_items ] = useState([]);
  const [ updating, $_updating ] = useState(false);

  // --- EFFECTS ------------------------------------------------ //
  useEffect(() => {
    async function start() {
      
    }
    start();
  }, []);

  useEffect(() => {
    if (!loading) {
      load();
    }
  }, []);

  // --- METHODS ------------------------------------------------ //
  const load = async () => {
    
  };

  const overlay_off = () => {
    document.getElementById('support').classList.remove('active');
  };

  // --- RENDER ------------------------------------------------- //
  return (
    <div className="inside">
      <div className="overlay" onClick={ overlay_off }></div>
        <div className="grid">
          <Sidebar view="plan" />
          <div className="main">
            <div className="grid vcenter-xs">
              <div className="col-24-xs">
                <Hamburger />
                <h1>Plan</h1>
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

export default Plan;
