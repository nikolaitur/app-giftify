const _popup = (config, backend = false) => {

	return `
    <div class="giftify-popup__bg"></div>
    <div class="giftify-popup__inside">
      <a ${ backend ? '' : 'href="#"' } class="giftify-popup__close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M 38.982422 6.9707031 A 2.0002 2.0002 0 0 0 37.585938 7.5859375 L 24 21.171875 L 10.414062 7.5859375 A 2.0002 2.0002 0 0 0 8.9785156 6.9804688 A 2.0002 2.0002 0 0 0 7.5859375 10.414062 L 21.171875 24 L 7.5859375 37.585938 A 2.0002 2.0002 0 1 0 10.414062 40.414062 L 24 26.828125 L 37.585938 40.414062 A 2.0002 2.0002 0 1 0 40.414062 37.585938 L 26.828125 24 L 40.414062 10.414062 A 2.0002 2.0002 0 0 0 38.982422 6.9707031 z"/></svg></a>
    	<div class="giftify-popup__grid">
    		<div class="giftify-popup__left">
    			<div class="giftify-popup__header">
    				${ config.general.logo && config.general.logo != '' ? '<img src="' + config.general.logo + '" />' : '' }
    				<div class="giftify-popup__title">${ config.popup.texts.title }</div>
    			</div>
    			<div class="giftify-popup__steps">
    				<div class="giftify-popup__step giftify-popup__step--active" data-step="1">
    					<ol>
                            ${ config.popup.texts.line1 && config.popup.texts.line1 != '' ? '<li>' + config.popup.texts.line1 + '</li>' : '' }
                            ${ config.popup.texts.line2 && config.popup.texts.line2 != '' ? '<li>' + config.popup.texts.line2 + '</li>' : '' }
                            ${ config.popup.texts.line3 && config.popup.texts.line3 != '' ? '<li>' + config.popup.texts.line3 + '</li>' : '' }
                            ${ config.popup.texts.line4 && config.popup.texts.line4 != '' ? '<li>' + config.popup.texts.line4 + '</li>' : '' }
    					</ol>
                        <div class="giftify-popup__action">
                            <button class="giftify-popup__button giftify-popup__next" ${ backend ? 'id="popup-start"' : '' }>
                                <span>${ config.popup.buttons.texts.start }</span>
                            </button>
                        </div>
    				</div>
                    <div class="giftify-popup__step" data-step="2">
                        <form id="giftify-popup__form" autocomplete="off">
                            <div class="giftify-popup__label">${ config.popup.texts.to }</div>
                            <div class="giftify-popup__grid">
                                <div class="giftify-popup__field">
                                    <input type="text" name="rname" placeholder="${ config.popup.texts.rname }" required />
                                </div>
                                <div class="giftify-popup__field">
                                    <input type="email" name="remail" placeholder="${ config.popup.texts.remail }" required />
                                </div>
                            </div>
                            <div class="giftify-popup__label">${ config.popup.texts.from }</div>
                            <div class="giftify-popup__grid">
                                <div class="giftify-popup__field">
                                    <input type="text" name="yname" placeholder="${ config.popup.texts.yname }" required />
                                </div>
                                <div class="giftify-popup__field">
                                    <input type="email" name="yemail" placeholder="${ config.popup.texts.yemail }" required />
                                </div>
                            </div>
                            <div class="giftify-popup__label">${ config.popup.texts.message }</div>
                            <div class="giftify-popup__field">
                                <textarea name="ymessage" placeholder="${ config.popup.texts.ymessage }"></textarea>
                            </div>
                            <div class="giftify-popup__action">
                                <button class="giftify-popup__button giftify-popup__prev"${ backend ? 'id="popup-prev"' : '' }>
                                    <span>${ config.popup.buttons.texts.back }</span>
                                </button>
                                <button class="giftify-popup__button giftify-popup__next" ${ backend ? '' : 'type="submit"' }>
                                    <span>${ config.popup.buttons.texts.submit }</span>
                                </button>
                            </div>
                        </form>
                    </div>
    			</div>
    		</div>
    		${ config.popup.image != '' ? '<div class="giftify-popup__right" style="background-image: url(' + config.popup.image + ')"></div>' : '' }
    	</div>
    </div>
  `;

};

module.exports = _popup;