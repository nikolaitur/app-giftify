import React, { useState, useEffect, useRef } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import {Redirect} from '@shopify/app-bridge/actions'
import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router'

import X from '../helpers/x';

const Guide = () => {

  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const mount = useRef(true);

  useEffect(() => {
    async function start() {
      X(app).get('/a/global/guide', res => {
        window.active = res.active;
        if (res.guide) {
          document.getElementById('guide').classList.remove('hide');
        }
        return () => { mount.current = false; }
      });
    } 
    start();
  }, []);

  const support_show = () => {
    document.getElementById('support').classList.add('active');
  };

  const hide_guide = () => {
    document.getElementById('guide').classList.add('hide');
  }

  return (
    <div id="guide" className="alert info mb-3 hide">
      <a className="close" onClick={ hide_guide }><Image src="/icons/x.svg" width="20" height="20" /></a>
      <div className="heading">
        <h3>Let's send some gifts!</h3>
        <div className="message">Follow the guide below to set up the app.</div>
      </div>
      <div className="tutorial">
        <ol>
          <li>Enable app in <strong>General</strong> tab under the <Link href="/settings"><a><Image src="/icons/cog.svg" width="16" height="16" /> Settings</a></Link>.
            <ul>
              <li>If your live theme supports Online Store 2.0, go to <strong>Online Store</strong> <span className="text-success">❯</span> <strong>Customize</strong> <span className="text-success">❯</span> <strong>Templates</strong> <span className="text-success">❯</span> <strong>Cart</strong> <span className="text-success">❯</span> <strong>Add Block</strong> <span className="text-success">❯</span> <strong>Giftify Button Trigger</strong></li>
              <li>If your live theme doesn't support Online Store 2.0 - you don't need to do anything, app will automatically detect position where Button Trigger should be placed.</li>
            </ul>
          </li>
          <li>Set up your store settings there too - those will be used in the emails to recipients.</li>
          <li>Still in Settings, go to <strong>Button</strong> tab to configure your Giftify trigger. Button will be displayed in the cart.</li>
          <li>Under <strong>Popup</strong> tab you can change how the Giftify popup looks like to match your theme's look.</li>
          <li><strong>Pro</strong> tab gives you advanced settings if you have higher plan activated.</li>
          <li>Go to <Link href="/"><a><Image src="/icons/rocket.svg" width="16" height="16" /> Dashboard</a></Link> to see all gifts sent by your customers and check statuses of orders.</li>
          <li>If you need help - don't hesitate and contact us. Any information you will find in <a onClick={ support_show }>Support</a>.</li>
        </ol>
      </div>
    </div>
  );
}

export default Guide;


