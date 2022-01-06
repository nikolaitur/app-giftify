import React, { useState, useEffect } from "react";

const Formify = (init, validation = []) => {
  const [ inputs, $_inputs ] = useState(init || {});
  const [ errors, $_errors ] = useState({});

  const change = (e, replace = false) => {
    console.log('EEE', e, replace);
  	if (replace) {
  		if (typeof replace == 'boolean') {
        $_inputs(e);
      } else {
        $_inputs(inputs => ({ ...inputs, [replace]: e }));
      }
  	} else {
  		e.persist();
	    //$_inputs(inputs => ({ ...inputs, [e.target.name]: e.target.value }));
      const path = e.target.name.split('.');
      const depth = path.length;
      const oldstate = inputs;
      const newstate = { ...oldstate };
      let newStateLevel = newstate;
      let oldStateLevel = oldstate;

      for (let i = 0; i < depth; i += 1) {
        if (i === depth - 1) {
          newStateLevel[path[i]] = event.target.value;
        } else {
          newStateLevel[path[i]] = { ...oldStateLevel[path[i]] };
          oldStateLevel = oldStateLevel[path[i]];
          newStateLevel = newStateLevel[path[i]];
        }
      }
      $_inputs(newstate);

      if (errors[e.target.name]) {
        validate(e.target.name);
      }
  	}
  };

  const validate = (field = null) => {
    let err = field ? errors : {}, result = null;
    
    validation.forEach((param) => {
      if (!field || (field && field == param.field)) {
        result = param.check(param.field.split('.').reduce((p,c)=>p&&p[c]||null, inputs));
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