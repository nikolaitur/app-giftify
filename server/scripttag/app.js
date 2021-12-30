import icon from './partials/_icon';
import config from './partials/_config';
import _css from './partials/_css';
import _popup from './partials/_popup';

const generateScriptTag = (settings, dev) => {

  Object.assign(config, settings);

  const css = _css(config);
  const popup = _popup(config);

  const render = `
  	window.Giftify = {
  		init: function() {
        this.insertStyle();
  			this.initiateButton();
  		},
      insertStyle: function() {
        var head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode('${ css }'));
        head.appendChild(style);
      },
  		initiateButton: function() {
  			var wrappers = document.querySelectorAll('.giftify-wrapper');
  			if (wrappers.length) {
  				this.renderButton(wrappers);
  			} else {
  				var checkoutButtons = document.querySelectorAll('[name="checkout"]');
          if (checkoutButtons.length) {
            checkoutButtons.forEach(function(checkoutButton) {
              var el = document.createElement('div');
              el.classList.add('giftify-wrapper');
              checkoutButton.parentNode.insert${ config.button.place }(el, checkoutButton);
            });
            this.renderButton();
          }
  			}
  		},
  		renderButton: function(wrappers = null) {
        if (!wrappers) {
          wrappers = document.querySelectorAll('.giftify-wrapper');
        }
        if (wrappers && wrappers.length) {
          wrappers.forEach(function(wrapper) {
            buttonEl = document.createElement('a');
            buttonEl.href = '#';
            buttonEl.innerHTML = '<span>${ config.button.icon ? icon : '' } ${ config.button.text }</span>';
            buttonEl.classList.add('giftify-button');
            buttonEl.addEventListener('click', window.Giftify.openPopup);
            wrapper.appendChild(buttonEl);
          });

          var popupEl = document.createElement('div');
          popupEl.classList.add('giftify-popup');
          popupEl.innerHTML = '${ popup.replace(/'/g, "’") }';
          document.body.appendChild(popupEl);

          document.querySelector('.giftify-popup__bg').addEventListener('click', window.Giftify.closePopup);
          document.querySelector('.giftify-popup__close').addEventListener('click', window.Giftify.closePopup);
        }
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
      }
  	};

  	window.Giftify.init();
  `;

  return render.replace(/\s+/g, ' ').trim();
  
};

module.exports = generateScriptTag;