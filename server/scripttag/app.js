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
              var saved = {
                to: { name: '', email: '' },
                from: { name: '', email: '' },
                message: ''
              };
              if (localStorage.getItem('giftify')) { 
                saved = JSON.parse(localStorage.getItem('giftify')); 
              }
              var popupHTML = '${ popup.replace(/'/g, "’") }';
              popupHTML.replace('{saved.to.name}', saved.to.name);
              popupHTML.replace('{saved.to.email}', saved.to.email);
              popupHTML.replace('{saved.from.name}', saved.from.name);
              popupHTML.replace('{saved.from.email}', saved.from.email);
              popupHTML.replace('{saved.message}', saved.message);
              var popupEl = document.createElement('div');
              popupEl.classList.add('giftify-popup');
              popupEl.innerHTML = popupHTML;
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
          var form = e.target, attrs = {
            to: { name: form.rname.value, email: form.remail.value },
            from: { name: form.yname.value, email: form.yemail.value },
            message: form.ymessage.value
          };
          localStorage.setItem('giftify', JSON.stringify(attrs));
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
              'Giftify • To': attrs.to.name + ' (' + attrs.to.email + ')',
              'Giftify • From': attrs.from.name + ' (' + attrs.from.name + ')',
              'Giftify • Message': (attrs.message ? attrs.message : '-')
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