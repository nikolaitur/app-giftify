import React, { useState, useEffect, useRef } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';

// --- NEXT ----------------------------------------------------- //
import Image from 'next/image';
import Link from 'next/link';

// --- PARTIALS ------------------------------------------------- //
import Hamburger from '../partials/hamburger';
import Loadbars from '../partials/loadbars';
import Sidebar from '../partials/sidebar';
import GlobalStyle from '../partials/css';
import _popup from '../server/scripttag/partials/_popup';

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
  const [ smtp_verifing, $_smtp_verifing ] = useState(false);
  const [ tabs, $_tabs ] = useState(1);
  const [ step, $_step ] = useState(1);
  const [ data, $_data, $_valid, errors ] = Formify(init_data, SettingsValidator);
  const [ plan, $_plan ] = useState(1);

  // --- EFFECTS ------------------------------------------------ //
  useEffect(() => {
    async function start() {
      X(app).get('/a/settings', res => {
        $_data(res.data, true);
        $_plan(res.plan);
        $_loading(false);

        document.body.addEventListener('click', function(e) {
          if (e.target.id == 'popup-start') {
            e.preventDefault();
            $_step(2);
          }
          if (e.target.id == 'popup-prev') {
            e.preventDefault();
            $_step(1);
          }
        });

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
  const smtp_verify = async () => {
    $_smtp_verifing(true);
    X(app).post('/a/settings/vsmtp', data.pro.smtp, res => {
      $_smtp_verifing(false);
      Toast(app, 'SMTP connection works');
    }, (error) => {
      $_smtp_verifing(false);
      Toast(app, error, 'ERROR');
    });
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

  const toggle = (param1, param2, param3) => {
    $_data({
      target: {
        name: param1 + '.' + param2 + (param3 ? '.' + param3 : ''),
        value: param3 ? !data[param1][param2][param3] : !data[param1][param2]
      },
      persist: () => {}
    });
  }

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
                    <input type="checkbox" id="toggle" checked={ window.active } readOnly />
                    <label htmlFor="toggle" className="grid vcenter-xs" onClick={ activate }>
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
                  <a onClick={ () => { $_tabs(4) } } className={ tabs == 4 ? 'active' : '' }>Pro</a>
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
                        <div className="col-24-sm">
                          <div className="field">
                            <label>Text</label>
                            <input value={ data.button.text } onChange={ $_data } name="button.text" type="text" placeholder="e.g. Send as a gift" />
                          </div>
                        </div>
                      </div>
                      <div className="grid">
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Gift Icon</label>
                            <span className="toggleSwitch">
                              <input type="checkbox" id="toggleGiftIcon" checked={ data.button.icon } readOnly />
                              <label htmlFor="toggleGiftIcon" className="grid vcenter-xs" onClick={ () => { toggle('button', 'icon') } }>
                                <div className="switch empty">
                                  <div className="dot"></div>
                                </div>
                              </label>
                            </span>
                          </div>
                        </div>
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Icon Color</label>
                            <ColorPicker color={ data.button.iconColor } name="button.iconColor" onChange={ $_data } />
                          </div>
                        </div>
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Hover Icon Color</label>
                            <ColorPicker color={ data.button.hoverIconColor } name="button.hoverIconColor" onChange={ $_data } />
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
                      <div className="grid">
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Border Radius (px)</label>
                            <input value={ data.button.borderRadius } onChange={ $_data } name="button.borderRadius" type="number" min="0" />
                          </div>
                        </div>
                        <div className="col-16-sm">
                          <div className="field">
                            <label>Placement</label>
                            <select value={ data.status } onChange={ $_data } name="button.place">
                              <option value="Before">Before Checkout Button</option>
                              <option value="After">After Checkout Button</option>
                            </select> 
                            <Image src="/icons/dropdown.svg" width="9" height="9" />
                          </div>
                        </div>
                      </div>
                      <div className="grid">
                        <div className="col-24-sm">
                          <div className="field">
                            <label>Padding (px)</label>
                            <div className="grid">
                              <div className="col-12-xs col-6-sm">
                                <label></label><small>Top</small>
                                <input value={ data.button.padding.top } onChange={ $_data } name="button.padding.top" type="number" min="0" />
                              </div>
                              <div className="col-12-xs col-6-sm">
                                <label></label><small>Right</small>
                                <input value={ data.button.padding.right } onChange={ $_data } name="button.padding.right" type="number" min="0" />
                              </div>
                              <div className="col-12-xs col-6-sm">
                                <label></label><small>Bottom</small>
                                <input value={ data.button.padding.bottom } onChange={ $_data } name="button.padding.bottom" type="number" min="0" />
                              </div>
                              <div className="col-12-xs col-6-sm">
                                <label></label><small>Left</small>
                                <input value={ data.button.padding.left } onChange={ $_data } name="button.padding.left" type="number" min="0" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid">
                        <div className="col-24-sm">
                          <div className="field">
                            <label>Margin (px)</label>
                            <div className="grid">
                              <div className="col-12-xs col-6-sm">
                                <label></label><small>Top</small>
                                <input value={ data.button.margin.top } onChange={ $_data } name="button.margin.top" type="number" />
                              </div>
                              <div className="col-12-xs col-6-sm">
                                <label></label><small>Right</small>
                                <input value={ data.button.margin.right } onChange={ $_data } name="button.margin.right" type="number" />
                              </div>
                              <div className="col-12-xs col-6-sm">
                                <label></label><small>Bottom</small>
                                <input value={ data.button.margin.bottom } onChange={ $_data } name="button.margin.bottom" type="number" />
                              </div>
                              <div className="col-12-xs col-6-sm">
                                <label></label><small>Left</small>
                                <input value={ data.button.margin.left } onChange={ $_data } name="button.margin.left" type="number" />
                              </div>
                            </div>
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
                    </div>
                  </div>
                </div>

                <div className="tab" style={{display : tabs == 3 ? 'block' : 'none' }}>
                  <div className="grid">
                    <div className="col-12-sm">
                      <div className="grid">
                        <div className="col-16-sm">
                          <div className="field">
                            <label>Image URL</label>
                            <small>You can use <a onClick={ () => { adminURL('/settings/files') } }>Files</a> to store the image. Read more <a href="https://help.shopify.com/en/manual/shopify-admin/productivity-tools/file-uploads" target="_blank">here</a></small>
                            <input value={ data.popup.image } onChange={ $_data } name="popup.image" type="text" />
                          </div>
                        </div>
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Show logo?</label>
                            <small>Set in General settings</small>
                            <span className="toggleSwitch">
                              <input type="checkbox" id="toggleLogo" checked={ data.popup.logo } readOnly />
                              <label htmlFor="toggleLogo" className="grid vcenter-xs" onClick={ () => { toggle('popup', 'logo') } }>
                                <div className="switch empty">
                                  <div className="dot"></div>
                                </div>
                              </label>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid">
                        <div className="col-24-sm">
                          <div className="field">
                            <label className="hr"><span>Button - Start & Buy</span></label>
                          </div>
                        </div>
                      </div>
                      <div className="grid">
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Background Color</label>
                            <ColorPicker color={ data.popup.buttons.next.bgColor } name="popup.buttons.next.bgColor" onChange={ $_data } />
                          </div>
                        </div>
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Text Color</label>
                            <ColorPicker color={ data.popup.buttons.next.txtColor } name="popup.buttons.next.txtColor" onChange={ $_data } />
                          </div>
                        </div>
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Border Color</label>
                            <ColorPicker color={ data.popup.buttons.next.borderColor } name="popup.buttons.next.borderColor" onChange={ $_data } />
                          </div>
                        </div>
                      </div>
                      <div className="grid">
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Hover Background Color</label>
                            <ColorPicker color={ data.popup.buttons.next.hoverBgColor } name="popup.buttons.next.hoverBgColor" onChange={ $_data } />
                          </div>
                        </div>
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Hover Text Color</label>
                            <ColorPicker color={ data.popup.buttons.next.hoverTxtColor } name="popup.buttons.next.hoverTxtColor" onChange={ $_data } />
                          </div>
                        </div>
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Hover Border Color</label>
                            <ColorPicker color={ data.popup.buttons.next.hoverBorderColor } name="popup.buttons.next.hoverBorderColor" onChange={ $_data } />
                          </div>
                        </div>
                      </div>
                      <div className="grid">
                        <div className="col-24-sm">
                          <div className="field">
                            <label className="hr"><span>Button - Back</span></label>
                          </div>
                        </div>
                      </div>
                      <div className="grid">
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Background Color</label>
                            <ColorPicker color={ data.popup.buttons.prev.bgColor } name="popup.buttons.prev.bgColor" onChange={ $_data } />
                          </div>
                        </div>
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Text Color</label>
                            <ColorPicker color={ data.popup.buttons.prev.txtColor } name="popup.buttons.prev.txtColor" onChange={ $_data } />
                          </div>
                        </div>
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Border Color</label>
                            <ColorPicker color={ data.popup.buttons.prev.borderColor } name="popup.buttons.prev.borderColor" onChange={ $_data } />
                          </div>
                        </div>
                      </div>
                      <div className="grid">
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Hover Background Color</label>
                            <ColorPicker color={ data.popup.buttons.prev.hoverBgColor } name="popup.buttons.prev.hoverBgColor" onChange={ $_data } />
                          </div>
                        </div>
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Hover Text Color</label>
                            <ColorPicker color={ data.popup.buttons.prev.hoverTxtColor } name="popup.buttons.prev.hoverTxtColor" onChange={ $_data } />
                          </div>
                        </div>
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Hover Border Color</label>
                            <ColorPicker color={ data.popup.buttons.prev.hoverBorderColor } name="popup.buttons.prev.hoverBorderColor" onChange={ $_data } />
                          </div>
                        </div>
                      </div>
                      <div className="grid">
                        <div className="col-24-sm">
                          <div className="field">
                            <label className="hr"><span>Buttons General</span></label>
                          </div>
                        </div>
                      </div>
                      <div className="grid">
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Border Radius (px)</label>
                            <input value={ data.popup.buttons.borderRadius } onChange={ $_data } name="popup.buttons.borderRadius" type="number" min="0" />
                          </div>
                        </div>
                      </div>
                      <div className="grid">
                        <div className="col-24-sm">
                          <div className="field">
                            <label>Padding (px)</label>
                            <div className="grid">
                              <div className="col-12-xs col-6-sm">
                                <label></label><small>Top</small>
                                <input value={ data.popup.buttons.padding.top } onChange={ $_data } name="popup.buttons.padding.top" type="number" min="0" />
                              </div>
                              <div className="col-12-xs col-6-sm">
                                <label></label><small>Right</small>
                                <input value={ data.popup.buttons.padding.right } onChange={ $_data } name="popup.buttons.padding.right" type="number" min="0" />
                              </div>
                              <div className="col-12-xs col-6-sm">
                                <label></label><small>Bottom</small>
                                <input value={ data.popup.buttons.padding.bottom } onChange={ $_data } name="popup.buttons.padding.bottom" type="number" min="0" />
                              </div>
                              <div className="col-12-xs col-6-sm">
                                <label></label><small>Left</small>
                                <input value={ data.popup.buttons.padding.left } onChange={ $_data } name="popup.buttons.padding.left" type="number" min="0" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid">
                        <div className="col-24-sm">
                          <div className="field">
                            <label className="hr"><span>Buttons Labels</span></label>
                          </div>
                        </div>
                      </div>
                      <div className="grid">
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Start</label>
                            <input value={ data.popup.buttons.texts.start } onChange={ $_data } name="popup.buttons.texts.start" type="text" />
                          </div>
                        </div>
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Back</label>
                            <input value={ data.popup.buttons.texts.back } onChange={ $_data } name="popup.buttons.texts.back" type="text" />
                          </div>
                        </div>
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Buy</label>
                            <input value={ data.popup.buttons.texts.submit } onChange={ $_data } name="popup.buttons.texts.submit" type="text" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-1-sm"></div>
                    <div className="col-11-sm">
                      <div className="field">
                        <label>Title</label>
                        <input value={ data.popup.texts.title } onChange={ $_data } name="popup.texts.title" type="text" placeholder="e.g. Send As a Gift" />
                      </div>
                      <div className="field">
                        <label>Guide - Line 1</label>
                        <input value={ data.popup.texts.line1 } onChange={ $_data } name="popup.texts.line1" type="text" />
                      </div>
                      <div className="field">
                        <label>Guide - Line 2</label>
                        <input value={ data.popup.texts.line2 } onChange={ $_data } name="popup.texts.line2" type="text" />
                      </div>
                      <div className="field">
                        <label>Guide - Line 3</label>
                        <input value={ data.popup.texts.line3 } onChange={ $_data } name="popup.texts.line3" type="text" />
                      </div>
                      <div className="field">
                        <label>Guide - Line 4</label>
                        <input value={ data.popup.texts.line4 } onChange={ $_data } name="popup.texts.line4" type="text" />
                      </div>
                      <div className="field">
                        <label>Recipient Full Name</label>
                        <input value={ data.popup.texts.rname } onChange={ $_data } name="popup.texts.rname" type="text" />
                      </div>
                      <div className="field">
                        <label>Recipient Email</label>
                        <input value={ data.popup.texts.remail } onChange={ $_data } name="popup.texts.remail" type="text" />
                      </div>
                      <div className="field">
                        <label>Your Full Name</label>
                        <input value={ data.popup.texts.yname } onChange={ $_data } name="popup.texts.yname" type="text" />
                      </div>
                      <div className="field">
                        <label>Your Email</label>
                        <input value={ data.popup.texts.yemail } onChange={ $_data } email="popup.texts.yemail" type="text" />
                      </div>
                      <div className="field">
                        <label>Your Message</label>
                        <input value={ data.popup.texts.ymessage } onChange={ $_data } email="popup.texts.ymessage" type="text" />
                      </div>
                      <div className="grid">
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Label - To</label>
                            <input value={ data.popup.texts.to } onChange={ $_data } name="popup.texts.to" type="text" />
                          </div>
                        </div>
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Label - From</label>
                            <input value={ data.popup.texts.from } onChange={ $_data } name="popup.texts.from" type="text" />
                          </div>
                        </div>
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Label - Message</label>
                            <input value={ data.popup.texts.message } onChange={ $_data } name="popup.texts.message" type="text" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid">
                    <div className="col-24-sm">
                      <button className={ `btn ${ updating ? 'updating' : '' }` } onClick={ save }>Save</button>
                    </div>
                  </div>
                  <div className="grid mt-3">
                    <div className="col-24-sm">
                      <div className="field">
                        <label>Popup Preview</label>
                        <small>Please mind differences due to theme CSS</small>
                        <div className="popup-preview" data-step={ step }>
                          <div dangerouslySetInnerHTML={{__html: _popup(data, true) }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tab" style={{display : tabs == 4 ? 'block' : 'none' }}>
                  { (plan == 1) && (
                    <>
                      <div className="grid">
                        <div className="col-24-sm">
                          <p className="grid vcenter-xs"><Image src="/icons/error.svg" width="25" height="24" /><span className="pl-2">You need higher plan to edit these settings. Click <Link href="/plan"><a className="text-success">here</a></Link> to switch plans.</span></p>
                        </div>
                      </div>
                      <div className="grid disabled mt-4">
                        <div className="col-8-sm">
                          <div className="field">
                            <label>Show branding?</label>
                            <span className="toggleSwitch">
                              <input type="checkbox" id="toggleBranding" checked readOnly />
                              <label htmlFor="toggleBranding" className="grid vcenter-xs">
                                <div className="switch empty">
                                  <div className="dot"></div>
                                </div>
                              </label>
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  { (plan == 2) && (
                    <>
                      <div className="grid">
                        <div className="col-12-sm">
                          <div className="grid">
                            <div className="col-8-sm">
                              <div className="field">
                                <label>Show branding?</label>
                                <span className="toggleSwitch">
                                  <input type="checkbox" id="toggleBranding" checked={ data.pro.branding } readOnly />
                                  <label htmlFor="toggleBranding" className="grid vcenter-xs" onClick={ () => { toggle('pro', 'branding') } }>
                                    <div className="switch empty">
                                      <div className="dot"></div>
                                    </div>
                                  </label>
                                </span>
                              </div>
                            </div>
                            <div className="col-8-sm">
                              <div className="field">
                                <label>Custom SMTP server</label>
                                <span className="toggleSwitch">
                                  <input type="checkbox" id="toggleSMTP" checked={ data.pro.smtp.active } readOnly />
                                  <label htmlFor="toggleSMTP" className="grid vcenter-xs" onClick={ () => { toggle('pro', 'smtp', 'active') } }>
                                    <div className="switch empty">
                                      <div className="dot"></div>
                                    </div>
                                  </label>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      { (data.pro.smtp.active) && (
                        <>
                          <div className="grid">
                            <div className="col-24-sm">
                              <div className="field">
                                <label className="hr"><span>SMTP Settings</span></label>
                                <small>Fill the fields below to use your own SMTP server to send emails within your domain</small>
                              </div>
                            </div>
                          </div>
                          <div className="grid">
                            <div className="col-12-sm">
                              <div className="field">
                                <label>Username</label>
                                <input value={ data.pro.smtp.username } onChange={ $_data } name="pro.smtp.username" type="text" />
                              </div>
                            </div>
                            <div className="col-12-sm">
                              <div className="field">
                                <label>Password</label>
                                <input value={ data.pro.smtp.password } onChange={ $_data } name="pro.smtp.password" type="password" />
                              </div>
                            </div>
                          </div>
                          <div className="grid vend-xs">
                            <div className="col-6-sm">
                              <div className="field">
                                <label>Host</label>
                                <input value={ data.pro.smtp.host } onChange={ $_data } name="pro.smtp.host" type="text" />
                              </div>
                            </div>
                            <div className="col-6-sm">
                              <div className="field">
                                <label>Port</label>
                                <input value={ data.pro.smtp.port } onChange={ $_data } name="pro.smtp.port" type="number" />
                              </div>
                            </div>
                            <div className="col-4-sm">
                              <div className="field">
                                <label>Encryption</label>
                                <select value={ data.pro.smtp.encryption } onChange={ $_data } name="pro.smtp.encryption">
                                  <option value="">None</option>
                                  <option value="ssl">SSL</option>
                                  <option value="tls">TLS</option>
                                </select> 
                                <Image src="/icons/dropdown.svg" width="9" height="9" />
                              </div>
                            </div>
                            <div className="col-4-sm">
                              <div className="field">
                                <label>Authentication</label>
                                <select value={ data.pro.smtp.authentication } onChange={ $_data } name="pro.smtp.authentication">
                                  <option value="1">Yes</option>
                                  <option value="0">No</option>
                                </select> 
                                <Image src="/icons/dropdown.svg" width="9" height="9" />
                              </div>
                            </div>
                            <div className="col-4-sm">
                              <button className={ `btn error ${ smtp_verifing ? 'updating' : '' }` } onClick={ smtp_verify }>Verify SMTP</button>
                              <div className="field"></div>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="grid">
                        <div className="col-24-sm">
                          <button className={ `btn ${ updating ? 'updating' : '' }` } onClick={ save }>Save</button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
    </div>
  );
}

export default Settings;
