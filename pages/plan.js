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
              <div className="pricing-plans mt-3">
                <div className="grid">
                  <div className="col-12-sm">
                    <div className={ plan == 1 ? 'active column' : 'column' }>
                      <div className="title">Basic</div>
                      <div className="price">$9.99 <small>/ month</small></div>
                      <ul>
                        <li className="check">Unlimited gift emails</li>
                        <li className="check">Customizable trigger button and gift popup</li>
                        <li className="check">Confirmation emails</li>
                        <li className="uncheck">Hide Branding</li>
                        <li className="uncheck">Custom SMTP Server</li>
                        <li className="uncheck">Send email updates on fulfillments</li>
                        <li className="uncheck">Edit email templates</li>
                      </ul>
                      <div className="text-center mt-4">
                        { (plan == 1) && (
                          <a className="btn disabled">Selected</a>
                        )}
                        { (plan == 2) && (
                          <a className="btn" onClick={ () => { changePlan(1) } }>Select this plan</a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-12-sm">
                    <div className={ plan == 2 ? 'active column' : 'column' }>
                      <div className="title">Pro</div>
                      <div className="price">$19.99 <small>/ month</small></div>
                      <ul>
                        <li className="check">Unlimited gift emails</li>
                        <li className="check">Customizable trigger button and gift popup</li>
                        <li className="check">Confirmation emails</li>
                        <li className="check">Hide Branding</li>
                        <li className="check">Custom SMTP Server</li>
                        <li className="check">Send email updates on fulfillments</li>
                        <li className="check">Edit email templates</li>
                      </ul>
                      <div className="text-center mt-4">
                        { (plan == 2) && (
                          <a className="btn disabled">Selected</a>
                        )}
                        { (plan == 1) && (
                          <a className="btn" onClick={ () => { changePlan(2) } }>Select this plan</a>
                        )}
                      </div>
                    </div>
                  </div>  
                </div>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}

export default Plan;
