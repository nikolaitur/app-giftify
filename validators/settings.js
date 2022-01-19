const SettingsValidator = [
  {
    field: 'general.name',
    check: (value) => {
      if (!value || (value && value.trim() === '')) { return 'Required'; }
      if (value && value.trim().length < 2) { return 'Too short'; }
      return null;
    }
  },
  {
    field: 'general.email',
    check: (value) => {
      if (!value || (value && value.trim() === '')) { return 'Required'; }
      //if (value && /\S+@\S+\.\S+/.test(value)) { return 'Invalid email address'; }
      return null;
    }
  },
  {
    field: 'pro.emails.confirmation.subject',
    check: (value) => {
      if (!value || (value && value.trim() === '')) { return 'Required'; }
      return null;
    }
  },
  {
    field: 'pro.emails.update.subject',
    check: (value) => {
      if (!value || (value && value.trim() === '')) { return 'Required'; }
      return null;
    }
  }
];

export default SettingsValidator;