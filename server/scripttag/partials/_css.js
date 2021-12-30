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
      margin: ${ config.popup.title.margin.top }px ${ config.popup.title.margin.right }px ${ config.popup.title.margin.bottom }px ${ config.popup.title.margin.left }px; 
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
    .giftify-popup__right {
      width: 50%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
  `;

};

module.exports = _css;