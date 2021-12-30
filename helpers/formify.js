import React, { useState, useEffect } from "react";

const Formify = (init, validation = []) => {
  const [ inputs, $_inputs ] = useState(init || {});
  const [ errors, $_errors ] = useState({});

  const change = (e, replace = false) => {
  	if (replace) {
  		if (typeof replace == 'boolean') {
        $_inputs(e);
      } else {
        $_inputs(inputs => ({ ...inputs, [replace]: e }));
      }
  	} else {
  		e.persist();
	    $_inputs(inputs => ({ ...inputs, [e.target.name]: e.target.value }));

      if (errors[e.target.name]) {
        validate(e.target.name);
      }
  	}
  };

  const validate = (field = null) => {
    let err = field ? errors : {}, result = null;
    
    validation.forEach((param) => {
      if (!field || (field && field == param.field)) {
        result = param.check(inputs[param.field]);
        if (result) {
          err[param.field] = result;
        } else {
          if (err[param.field]) delete err[param.field];
        }
      }
    }); 

    $_errors(err);

    if (field == null) {
      return !Object.keys(err).length;
    }
  };
  
  return [ inputs, change, validate, errors ];
}


export default Formify;