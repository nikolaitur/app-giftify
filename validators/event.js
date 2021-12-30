const EventValidator = [
  {
    field: 'title',
    check: (value) => {
      if (value.trim() === '') { return 'Required'; }
      if (value.trim().length < 2) { return 'Too short'; }
      return null;
    }
  },
  {
    field: 'theme',
    check: (value) => {
      if (value.toString().trim() === '') { return 'Required'; }
      if (/^[0-9]*$/.test(value) == false) { return 'Wrong value'; }
      return null;
    }
  },
  {
    field: 'status',
    check: (value) => {
      if (value != 'scheduled' && value != 'draft') { return 'Wrong value'; }
      return null;
    }
  },
  {
    field: 'date',
    check: (value) => {
      if (value.toString().trim() === '') { return 'Required'; }
      if (/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(value) == false) { return 'Wrong value'; }
      return null;
    }
  },
  {
    field: 'hours',
    check: (value) => {
      if (value.toString().trim() === '') { return 'Required'; }
      if (/[1-9]|1[0-2]/.test(value) == false) { return 'Wrong value'; }
      return null;
    }
  },
  {
    field: 'minutes',
    check: (value) => {
      if (value.toString().trim() === '') { return 'Required'; }
      if (/0[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]/.test(value) == false) { return 'Wrong value'; }
      return null;
    }
  },
  {
    field: 'period',
    check: (value) => {
      if (value.trim() === '') { return 'Required'; }
      if (value.trim() !== 'am' && value.trim() !== 'pm') { return 'Wrong value'; }
      return null;
    }
  }
];

export default EventValidator;