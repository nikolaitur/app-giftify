const _css = (config) => {

	return `
    .giftify-wrapper { width: 100% }
    .giftify-button { 
      margin: ${ config.button.margin.top }px ${ config.button.margin.right }px ${ config.button.margin.bottom }px ${ config.button.margin.left }px; 
      display: inline-block;
      transition: all .2s ease;
    }
    .giftify-button span {
      background: ${ config.button.bgColor };
      color: ${ config.button.txtColor };
      border-radius: ${ config.button.borderRadius }px;
      border: 2px solid ${ config.button.borderColor };
      padding: ${ config.button.padding.top }px ${ config.button.padding.right }px ${ config.button.padding.bottom }px ${ config.button.padding.left }px; 
      display: flex;
      white-space: nowrap;
      transition: all .2s ease;
    }
    .giftify-button svg { 
      fill: ${ config.button.iconColor };
      display: inline-block; 
      margin-right: 5px;
      width: 24px;
      height: 24px;
      transition: all .2s ease;
    }
    .giftify-button:hover span {
      background: ${ config.button.hoverBgColor };
      color: ${ config.button.hoverTxtColor };
      border-color: ${ config.button.hoverBorderColor };
    }
    .giftify-button:hover svg {
      fill: ${ config.button.hoverIconColor };
    }
    .giftify-popup {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 999;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: all .5s ease;
    }
    .giftify-popup.giftify-popup--loading {
      pointer-events: none;
    }
    .giftify-popup.giftify-popup--active {
      opacity: 1;
      visibility: visible;
      pointer-events: all;
    }
    .giftify-popup.giftify-popup--active .giftify-popup__inside {
      transition-delay: .3s;
      opacity: 1;
      margin-top: 0;
    }
    .giftify-popup__bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,.6);
      z-index: 1;
    }
    .giftify-popup__inside {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      width: 90%;
      max-width: ${ config.popup.image == '' ? 460 : 920 }px;
      display: flex;
      align-items: stretch;
      z-index: 2;
      transition: margin .5s Cubic-bezier(0.3, 0, 0.3, 1), opacity .3s ease;
      margin-top: 50px;
      opacity: 0;
    }
    .giftify-popup__close {
      position: absolute;
      top: 0;
      right: 0;
      width: 48px;
      height: 48px;
      z-index: 3;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .giftify-popup__close svg {
      fill: ${ config.popup.closeColor };
      width: 24px;
    }
    .giftify-popup__grid {
      display: flex;
      width: 100%;
    }
    .giftify-popup__right {
      width: 50%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
    .giftify-popup__left {
      width: ${ config.popup.image == '' ? 100 : 50 }%;
      padding: 75px 50px;
    }
    .giftify-popup__header {
      text-align: center;
    }
    .giftify-popup__header img {
      max-height: 50px;
    }
    .giftify-popup__title {
      color: ${ config.popup.title.txtColor };
      font-size: ${ config.popup.title.fontSize };
      margin-bottom: 20px;
    }
    .giftify-popup__step {
      display: none;
    }
    .giftify-popup__step--active {
      display: block;
    }
    .giftify-popup__action {
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .giftify-popup__button { 
      margin: 5px; 
      display: inline-block;
      transition: all .2s ease;
      padding: 0;
      border: 0;
      border-radius: 0!important;
      background: none!important;
    }
    .giftify-popup__button span {
      border-radius: ${ config.button.borderRadius }px;
      padding: ${ config.button.padding.top }px ${ config.button.padding.right }px ${ config.button.padding.bottom }px ${ config.button.padding.left }px; 
      display: flex;
      white-space: nowrap;
      transition: all .2s ease;
      position: relative;
    }
    .giftify-popup__next span {
      background: ${ config.popup.buttons.next.bgColor };
      color: ${ config.popup.buttons.next.txtColor };
      border: 2px solid ${ config.popup.buttons.next.borderColor };
      position: relative;
    }
    .giftify-popup__next:hover span {
      background: ${ config.popup.buttons.next.hoverBgColor };
      color: ${ config.popup.buttons.next.hoverTxtColor };
      border-color: ${ config.popup.buttons.next.hoverBorderColor };
    }
    .giftify-popup__prev span {
      background: ${ config.popup.buttons.prev.bgColor };
      color: ${ config.popup.buttons.prev.txtColor };
      border: 2px solid ${ config.popup.buttons.prev.borderColor };
    }
    .giftify-popup__prev:hover span {
      background: ${ config.popup.buttons.prev.hoverBgColor };
      color: ${ config.popup.buttons.prev.hoverTxtColor };
      border-color: ${ config.popup.buttons.prev.hoverBorderColor };
    }
    .giftify-popup__next span::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      border: 3px solid ${ config.popup.buttons.next.txtColor };
      border-top: 3px solid transparent;
      border-radius: 50%;
      margin-left: -10px;
      margin-top: -10px;
      opacity: 0;
      -webkit-animation: giftify_spin .7s linear infinite;
      animation: giftify_spin .7s linear infinite;
    }
    @-webkit-keyframes giftify_spin { 
      100% { -webkit-transform: rotate(360deg); } 
    }
    @keyframes giftify_spin { 
      100% { 
          -webkit-transform: rotate(360deg); 
          transform:rotate(360deg); 
      } 
    }
    .giftify-popup__step ol {
      counter-reset: giftify;
      list-style: none;
    }
    .giftify-popup__step li {
      color: ${ config.popup.lines.txtColor };
      font-size: ${ config.popup.lines.fontSize };
      counter-increment: giftify;
      position: relative;
      padding-left: 30px;
      display: block;
    }
    .giftify-popup__step li + li {
      margin-top: 5px;
    }
    .giftify-popup__step li::before {
      content: counter(giftify)".";
      font-weight: bold;
      top: 0;
      left: 0;
      position: absolute;
    }
    .giftify-popup__label { 
      font-weight: bold;
      text-align: center;
    }
    .giftify-popup__field {
      margin: 5px 0 10px;
    }
    .giftify-popup__grid > .giftify-popup__field {
      width: 50%;
      padding-right: 2px;
    }
    .giftify-popup__grid > .giftify-popup__field + .giftify-popup__field {
      padding-left: 2px;
    }
    .giftify-popup__field > * {
      width: 100%;
    }
    .giftify-popup--loading .giftify-popup__next span {
      color: transparent!important;
    }
    .giftify-popup--loading .giftify-popup__next span::after {
      opacity: 1;
    }
  `;

};

module.exports = _css;