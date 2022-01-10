import React, { useState, useEffect, useRef } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';

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
  const redirect = Redirect.create(app);
  const mount = useRef(true);

  // --- STATES ------------------------------------------------- //
  const [ loading, $_loading ] = useState(true);
  const [ updating, $_updating ] = useState(false);
  const [ plan, $_plan ] = useState(1);

  // --- EFFECTS ------------------------------------------------ //
  useEffect(() => {
    async function start() {
      X(app).get('/a/settings/plan', res => {
        $_plan(res.plan);
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
  const changePlan = async (plan) => {
    $_updating(true);
    X(app).post('/a/settings/plan', { plan: plan }, res => {
      if (res.redirect) {
        redirect.dispatch(Redirect.Action.REMOTE, res.redirect);
      } else {
        $_updating(false);
      }
    }, (error) => {
      $_updating(false);
      Toast(app, error, 'ERROR');
    });
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
                { plan }
                <button onClick={ () => { changePlan(1) } }>Upgrade to 1</button>
                <button onClick={ () => { changePlan(2) } }>Upgrade to 2</button>
              </>
            )}
          </div>
        </div>
    </div>
  );
}

export default Plan;
