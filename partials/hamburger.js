import Image from 'next/image';

const sidebar_show = () => {
	document.querySelector('.sidebar').classList.add('show');
};

const Hamburger = () => {
  return (
    <a className="hamburger" onClick={ sidebar_show }>
      <span></span>
      <span></span>
      <span></span>
    </a>
  );
}

export default Hamburger;