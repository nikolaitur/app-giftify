import { Toast } from '@shopify/app-bridge/actions';

const Toaster = (app, message, error = '') => {
  const options = {
    message: message,
    duration: 3000,
    isError: error ? true : false
  }

  const toastNotice = Toast.create(app, options);
  toastNotice.dispatch(Toast.Action.SHOW);
}


export default Toaster;