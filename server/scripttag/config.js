import config from './partials/_config';

const generateConfig = (settings) => {

  Object.assign(config, settings);
  return JSON.stringify({
  	general: config.general,
  	button: config.button,
  	popup: config.popup,
  	pro: {
  		branding: config.pro.branding
  	}
  });
  
};

module.exports = generateConfig;