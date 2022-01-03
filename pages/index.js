import React, { useState, useEffect, useRef } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import DatePicker from 'react-date-picker/dist/entry.nostyle';

// --- NEXT ----------------------------------------------------- //
import Image from 'next/image';

// --- PARTIALS ------------------------------------------------- //
import Hamburger from '../partials/hamburger';
import Loadbars from '../partials/loadbars';
import Pagination from '../partials/pagination';
import Sidebar from '../partials/sidebar';

// --- HELPERS -------------------------------------------------- //
import Fdate from '../helpers/fdate';
import X from '../helpers/x';
import Toast from '../helpers/toast';

// --- VALIDATORS ----------------------------------------------- //
import EventValidator from '../validators/event';

// --- VIEW ----------------------------------------------------- //
const Index = () => {

  // --- INITS -------------------------------------------------- //
  const app = useAppBridge();
  const mount = useRef(true);

  // --- STATES ------------------------------------------------- //
  const [ data, $_data ] = useState({});
  const [ items, $_items ] = useState([]);
  const [ loading, $_loading ] = useState(true);
  const [ modal_active, $_modal_active ] = useState(false);
  const [ page, $_page ] = useState(1);
  const [ destroy_active, $_destroy_active ] = useState(false);
  const [ updating, $_updating ] = useState(false);

  // --- EFFECTS ------------------------------------------------ //
  useEffect(() => {
    async function start() {
      X(app).get('/a/gifts', res => {
        $_items(res.items);
        $_loading(false);
        return () => { mount.current = false; }
      }, (error) => {
        $_loading(false);
        Toast(app, error, 'ERROR');
      }, { 'X-Offset': Fdate().offset });
    } 
    start();
  }, []);

  useEffect(() => {
    if (!loading) {
      load();
    }
  }, [page]);

  // --- METHODS ------------------------------------------------ //
  const load = async () => {
    $_updating(true);
    X(app).get('/a/gifts/' + page, res => {
      $_items(res.items);
      $_updating(false);
      $_destroy_active(false);
    }, (error) => {
      $_updating(false);
      Toast(app, error, 'ERROR');
    }, { });
  };

  const destroy = async () => {
    $_updating(true);
    X(app).delete('/a/gifts/' + destroy_active, res => {
      if (items.length == 1 && page > 1) {
        $_page(page - 1);
      }
      Toast(app, 'Gift deleted');
      load();
    }, (error) => {
      $_updating(false);
      Toast(app, error, 'ERROR');
    }, { });
  };

  const overlay_off = () => {
    $_modal_active(false);
    $_destroy_active(false);
    document.getElementById('support').classList.remove('active');
  };

  // --- RENDER ------------------------------------------------- //
  return (
    <div className={ `inside ${ modal_active || destroy_active ? 'overlay-on' : '' } ${ updating ? 'updating' : '' }` }>
      <div className="overlay" onClick={ overlay_off }></div>
      <div className="grid">
        <Sidebar view="index" />
        <div className="main">
          <div className="grid vcenter-xs">
            <div className="col-24-xs">
              <Hamburger />
              <h1>Gifts Sent</h1>
            </div>
          </div>
          <button type="button" onClick={() => {
              throw new Error("Sentry Frontend Error");
          }}>
              Throw error
          </button>
          { (loading) && (
            <Loadbars />
          )}
          { (!loading) && (
            <>
              { (items.length == 0) && (
                <table className="mt-3 empty">
                  <thead>
                    <tr>
                      <th className="text-center">No Gifts have been sent yet.</th>
                    </tr>
                  </thead>
                </table>
              )}
              { (items.length > 0) && (
                <div className={ updating ? 'up' : '' }>
                  <table className="mt-3" id="events">
                    <thead>
                      <tr>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                    </tbody>
                  </table>
                  <Pagination items={ items } onPageChange={ (p) => { $_updating(true) ; $_page(p) } } />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className={ modal_active ? 'aside active' : 'aside' }>
        <a className="close" onClick={ () => $_modal_active(false) }><Image src="/icons/x.svg" width="20" height="20" /></a>
        <h2 className="mb-4">
          Gift for: <span>John Smith</span>
        </h2>
        <div className="body">
          
        </div>
      </div>
      <div className={ destroy_active ? 'aside small active' : 'aside small' }>
        <a className="close" onClick={ () => $_destroy_active(false) }><Image src="/icons/x.svg" width="20" height="20" /></a>
        <div className="center">
          <h2 className="mb-4">Delete gift?</h2>
          <div className="body">
            <div className="end">
              <button className={ `error btn w-100 ${ updating ? 'updating' : '' }` } onClick={ destroy }>Yes</button>
              <button className="default btn w-100 mt-2" onClick={ () => $_destroy_active(false) }>No</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
