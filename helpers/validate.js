import load from 'import-modules';
const validator = load('../validators');

const Validate = (name, inputs) => {
  let err = {}, result = null;
  
  validator[name].default.forEach((param) => {
    result = param.check(inputs[param.field]);
    if (result) {
      err[param.field] = result;
    }
  }); 

  return Object.keys(err).length == 0 ? 'success' : 'error';
};

export default Validate;