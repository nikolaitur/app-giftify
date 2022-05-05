import icon from './partials/_icon';
import config from './partials/_config';
import _css from './partials/_css';
import _popup from './partials/_popup';

const generateScriptTag = (settings, dev) => {

  Object.assign(config, settings);

  const css = _css(config);
  const popup = _popup(config);

  const render = `
    if (!window.Giftify) {
      window.Giftify = {
        checkoutButton: false,
        init: function() {
          this.reset();
          this.insertStyle();
          this.initiateButton();
        },
        reset: function() {
          var xhr = new XMLHttpRequest;
          xhr.open('POST', window.Shopify.routes.root + 'cart/update.js');
          xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
          xhr.send(JSON.stringify({
            attributes: {
              'Giftify • To': '',
              'Giftify • From': '',
              'Giftify • Message': ''
            }
          }));
        },
        insertStyle: function() {
          var head = document.head || document.getElementsByTagName('head')[0],
          style = document.createElement('style');
          style.type = 'text/css';
          style.appendChild(document.createTextNode('${ css }'));
          head.appendChild(style);
        },
        initiateButton: function() {
          var wrappers = document.querySelectorAll('.giftify-wrapper'),
              checkoutButtons = document.querySelectorAll('[name="checkout"]');
          if (wrappers.length) {
            this.renderButton();
          } else if (checkoutButtons.length) {
            this.checkoutButton = checkoutButtons[0];
            checkoutButtons.forEach(function(checkoutButton) {
              var el = document.createElement('div');
              el.classList.add('giftify-wrapper');
              checkoutButton.parentNode.insert${ config.button.place }(el, checkoutButton);
            });
            this.renderButton();
          }
        },
        renderButton: function(wrappers = null) {
          if (!wrappers) {
            wrappers = document.querySelectorAll('.giftify-wrapper');
          }
          if (wrappers && wrappers.length) {
            wrappers.forEach(function(wrapper) {
              if (!wrapper.querySelector('a')) {
                buttonEl = document.createElement('a');
                buttonEl.href = '#';
                buttonEl.innerHTML = '<span>${ config.button.icon ? icon : '' } ${ config.button.text }</span>';
                buttonEl.classList.add('giftify-button');
                buttonEl.addEventListener('click', window.Giftify.openPopup);
                wrapper.appendChild(buttonEl);
              }
            });

            if (!document.querySelector('.giftify-popup')) {
              var popupEl = document.createElement('div');
              popupEl.classList.add('giftify-popup');
              popupEl.innerHTML = '${ popup.replace(/'/g, "’") }';
              document.body.appendChild(popupEl);

              this.initiatePopupListeners();
            }
          }
        },
        initiatePopupListeners: function() {
          document.querySelector('.giftify-popup__bg').addEventListener('click', this.closePopup);
          document.querySelector('.giftify-popup__close').addEventListener('click', this.closePopup);
          document.querySelector('.giftify-popup__step[data-step="1"] .giftify-popup__next').addEventListener('click', this.buttonNext);
          document.querySelector('.giftify-popup__step[data-step="2"] .giftify-popup__prev').addEventListener('click', this.buttonPrev);
          document.querySelector('.giftify-popup__step[data-step="2"] form').addEventListener('submit', this.submitGift);
        },
        openPopup: function(e) {
          e.preventDefault();
          var popup = document.querySelector('.giftify-popup');
          if (popup) {
            popup.classList.add('giftify-popup--active');
          }
        },
        closePopup: function(e) {
          e.preventDefault();
          var popup = document.querySelector('.giftify-popup');
          if (popup) {
            popup.classList.remove('giftify-popup--active');
          }
        },
        buttonNext: function(e) {
          e.preventDefault();
          var step = document.querySelector('.giftify-popup__step[data-step="1"]');
          step.classList.remove('giftify-popup__step--active');
          step.nextElementSibling.classList.add('giftify-popup__step--active');
        },
        buttonPrev: function(e) {
          e.preventDefault();
          var step = document.querySelector('.giftify-popup__step[data-step="2"]');
          step.classList.remove('giftify-popup__step--active');
          step.previousElementSibling.classList.add('giftify-popup__step--active');
        },
        submitGift: function(e) {
          e.preventDefault();
          var form = e.target;
          document.querySelector('.giftify-popup').classList.add('giftify-popup--loading');
          var xhr = new XMLHttpRequest;
          xhr.open('POST', window.Shopify.routes.root + 'cart/update.js');
          xhr.onload = function() {
            if (window.Giftify.checkoutButton) {
              window.Giftify.checkoutButton.click();
            } else {
              location.href = '/checkout';
            }
          };
          xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
          xhr.send(JSON.stringify({
            attributes: {
              'Giftify • To': form.rname.value + ' (' + form.remail.value + ')',
              'Giftify • From': form.yname.value + ' (' + form.yemail.value + ')',
              'Giftify • Message': (form.ymessage.value ? form.ymessage.value : '-')
            }
          }));
        }
      };

      window.Giftify.init();
    }
  `;

  return render.replace(/\s+/g, ' ').trim();
  
};

module.exports = generateScriptTag;