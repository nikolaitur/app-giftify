import Image from 'next/image';
import Link from 'next/link';

const Sidebar = (props) => {

  const support_show = () => {
    document.getElementById('support').classList.add('active');
  };

  const sidebar_hide = () => {
    document.querySelector('.sidebar').classList.remove('show');
  };
  
  return (
    <div className="sidebar">
      <div className="over" onClick={ sidebar_hide }></div>
      <div className="in">
        <ul>
          <li className={ props.view == 'index' ? 'active' : '' }>
            <span><Image src="/icons/rocket.svg" width="20" height="20" /></span>
            <Link href="/">
              <a>Dashboard</a>
            </Link>
          </li>
          <li className={ props.view == 'settings' ? 'active' : '' }>
            <span><Image src="/icons/cog.svg" width="24" height="24" /></span>
            <Link href="/settings">
              <a>Settings</a>
            </Link>
          </li>
          <li className={ props.view == 'plan' ? 'active' : '' }>
            <span><Image src="/icons/plan.svg" width="24" height="24" /></span>
            <Link href="/plan">
              <a>Plan</a>
            </Link>
          </li>
          <li>
            <a onClick={ support_show }>Support</a>
          </li>
        </ul>
        <span className="graphic"><Image src="/graphic.svg" width="220" height="220" /></span>
      </div>
    </div>
  );
}

export default Sidebar;