const _popup = (config) => {

	return `
    <div class="giftify-popup__bg"></div>
    <div class="giftify-popup__inside">
      <a href="#" class="giftify-popup__close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M 38.982422 6.9707031 A 2.0002 2.0002 0 0 0 37.585938 7.5859375 L 24 21.171875 L 10.414062 7.5859375 A 2.0002 2.0002 0 0 0 8.9785156 6.9804688 A 2.0002 2.0002 0 0 0 7.5859375 10.414062 L 21.171875 24 L 7.5859375 37.585938 A 2.0002 2.0002 0 1 0 10.414062 40.414062 L 24 26.828125 L 37.585938 40.414062 A 2.0002 2.0002 0 1 0 40.414062 37.585938 L 26.828125 24 L 40.414062 10.414062 A 2.0002 2.0002 0 0 0 38.982422 6.9707031 z"/></svg></a>
    	<div class="giftify-popup__grid">
    		<div class="giftify-popup__left">
    			<div class="giftify-popup__header">
    				${ config.popup.logo != '' ? '<img src="' + config.popup.logo + '" />' : '' }
    				<div class="giftify-popup__title">${ config.popup.texts.title }</div>
    			</div>
    			<div class="giftify-popup__steps">
    				<div class="giftify-popup__step active" data-step="1">
    					<ol>
    						<li>${ config.popup.texts.line1 }</li>
    						<li>${ config.popup.texts.line2 }</li>
    						<li>${ config.popup.texts.line3 }</li>
    						<li>${ config.popup.texts.line4 }</li>
    					</ol>
    				</div>
    			</div>
    		</div>
    		${ config.popup.image != '' ? '<div class="giftify-popup__right" style="background-image: url(' + config.popup.image + ')"></div>' : '' }
    	</div>
    </div>
  `;

};

module.exports = _popup;