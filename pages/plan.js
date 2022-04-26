import React, { useState, useEffect, useRef } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Redirect, History } from '@shopify/app-bridge/actions';

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
  const history = History.create(app);
  history.dispatch(History.Action.PUSH, '/plan');
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

                <div className="pricing-plans">
                  <div className="grid">
                    <div className="col-16-sm">
                      <div className="grid">
                        <div className="col-12-sm">
                          <div className={ plan == 1 ? 'active column' : 'column' }>
                            <div className="title">Basic</div>
                            <div className="price">$5 <small>/ month</small></div>
                            <ul>
                              <li class="check">Customizable button and popup</li>
                              <li class="check">Confirmation emails</li>
                              <li class="uncheck">Hide Branding</li>
                              <li class="uncheck">Custom SMTP Server</li>
                              <li class="uncheck">Send email updates on fulfillments</li>
                              <li class="uncheck">Custom emails</li>
                            </ul>
                          </div>
                        </div>
                        <div className="col-12-sm">
                          <div className={ plan == 2 ? 'active column' : 'column' }>
                            <div className="title">Pro</div>
                            <div className="price">$10 <small>/ month</small></div>
                            <ul>
                              <li class="check">Customizable button and popup</li>
                              <li class="check">Confirmation emails</li>
                              <li class="check">Hide Branding</li>
                              <li class="check">Custom SMTP Server</li>
                              <li class="check">Send email updates on fulfillments</li>
                              <li class="check">Custom emails</li>
                            </ul>
                          </div>
                        </div>  
                      </div>  
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
    </div>
  );
}

export default Plan;
