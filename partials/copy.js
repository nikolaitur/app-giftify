import Image from 'next/image';

const Copy = () => {
  return (
    <div className="copy">
      <div className="grid">
        <div className="col-14-sm">
        	<h4>Check other great apps</h4>
        	<div className="app-item">
        		<div className="grid vcenter-xs">
        			<div className="thumb">
        				<a href="https://apps.shopify.com/theme-on-time" target="_blank">
        					<Image src="/tot.png" width="120" height="120" />
        				</a>
        			</div>
        			<div className="info">
        				<a href="https://apps.shopify.com/theme-on-time" className="title" target="_blank">Theme on Time</a>
        				<p className="short">Automate Theme Publishing</p>
        				<p className="long">Run & automate sales with ease. Schedule theme changes in accordance with your sales. Automate your theme publishing to coordinate with your online sale times.</p>
        				<a href="https://apps.shopify.com/theme-on-time" className="more" target="_blank">Check now <Image src="/icons/arrow-green.svg" width="12" height="12" /></a>
        			</div>
        		</div>
        	</div>
        </div>
        <div className="col-10-sm">
            Made with ❤ & ☕ in New York by <a href="https://minionmade.com" target="_blank">Minion Made</a>.
        </div>
      </div>
    </div>
  );
}

export default Copy;