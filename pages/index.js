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
import money from '../helpers/money';
import X from '../helpers/x';
import Toast from '../helpers/toast';

// --- VIEW ----------------------------------------------------- //
const Index = () => {

  // --- INITS -------------------------------------------------- //
  const app = useAppBridge();
  const mount = useRef(true);

  // --- STATES ------------------------------------------------- //
  const [ data, $_data ] = useState({ order: {}, gift: {} });
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
              <h1>Gifts</h1>
            </div>
          </div>
          { (loading) && (
            <Loadbars />
          )}
          { (!loading) && (
            <>
              { (items.length == 0) && (
                <table className="mt-3 empty">
                  <thead>
                    <tr>
                      <th className="text-center">No Gifts have been created yet.</th>
                    </tr>
                  </thead>
                </table>
              )}
              { (items.length > 0) && (
                <div className={ updating ? 'up' : '' }>
                  <table className="mt-3" id="gifts">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th className="text-center">Value</th>
                        <th className="text-center">Customer</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Created at</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      { items.slice(0,10).map((item, i) =>
                        <tr key={ item._id }>
                          <td>
                            <a>
                              <strong>{ item.order.name }</strong>
                            </a>
                          </td>
                          <td className="text-center cell" data-title="Value:">
                            { money(item.order.total_price, item.order.currency) }
                          </td>
                          <td className="text-center cell" data-title="Customer:">
                            <a>
                              { item.order.customer.first_name } { item.order.customer.last_name }
                            </a>
                          </td>
                          <td className="text-center cell" data-title="Status:">
                            { {
                              null: <span className="label">Unfulfilled</span>
                            } [item.order.fulfillment_status] }
                          </td>
                          <td className="text-center cell" data-title="Created at:">
                            { Fdate(item.order.created_at).format('client') }
                          </td>
                          <td className="nowrap cell last">
                            { (item.status != 'completed' && item.status != 'run') && (
                              <span className="action info" onClick={ () => { $_modal_active(true) ; $_data(item, true) } }><span>View</span><Image src="/icons/info.svg" width="14" height="14" /></span>
                            )}
                          </td>
                        </tr>
                      )}
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
        { (data.gift.To) && (
          <>
            <h2 className="mb-4">
              Gift details: { data.order.name }
            </h2>
            <div className="body">
              <div className="grid">
                <div className="col-24-xs">
                  <div className="field">
                    <label class="text-success">Recipient Name</label>
                    { data.gift.To.split(' (')[0] }
                  </div>
                  <div className="field">
                    <label class="text-success">Recipient Email</label>
                    { data.gift.To.replace(')', '').split(' (')[1] }
                  </div>
                  <div className="field">
                    <label class="text-success">Sender Name</label>
                    { data.gift.From.split(' (')[0] }
                  </div>
                  <div className="field">
                    <label class="text-success">Sender Email</label>
                    { data.gift.From.replace(')', '').split(' (')[1] }
                  </div>
                  <div className="field">
                    <label class="text-success">Message</label>
                    { data.gift.Message }
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Index;
