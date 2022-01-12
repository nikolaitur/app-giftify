import React, { useState, useEffect, useRef } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router'

import X from '../helpers/x';

const Guide = () => {

  const app = useAppBridge();
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

    const url_params = new URLSearchParams(window.location.search);

    if (url_params.get('view')) {
      Router.push('/' + url_params.get('view'));
    }
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
        <h3>Let's send some gits!</h3>
        <div className="message">Follow the guide below to create your first event.</div>
      </div>
      <div className="tutorial">
        <ol></ol>
      </div>
    </div>
  );
}

export default Guide;


