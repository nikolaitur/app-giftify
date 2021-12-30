import Image from 'next/image';

const Support = () => {

  const support_close = () => {
    document.getElementById('support').classList.remove('active');
  };

  const guide_open = () => {
    document.getElementById('guide').classList.remove('hide');
  };

  return (
    <div className="aside small" id="support">
      <a className="close" onClick={ support_close }><Image src="/icons/x.svg" width="20" height="20" /></a>
      <div className="center">
        <h2 className="mb-3 text-left">Support</h2>
        <div className="body">
        	<ul>
            <li>
              <span><Image src="/icons/quick.svg" width="16" height="16" /></span>
              <a onClick={ guide_open }>Quick Guide</a>
            </li>
            <li>
              <span><Image src="/icons/help.svg" width="16" height="16" /></span>
              <a href="https://minionmade.com/shopify-apps/theme-on-time#section-faq" target="_blank">FAQ</a>
            </li>
            <li>
              <span><Image src="/icons/contact.svg" width="16" height="16" /></span>
              <a href="https://minionmade.com/shopify-apps/theme-on-time#contact" target="_blank">Contact Us</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Support;