const SettingsValidator = [
  {
    field: 'info.name',
    check: (value) => {
      if (value.trim() === '') { return 'Required'; }
      if (value.trim().length < 2) { return 'Too short'; }
      return null;
    }
  }
];

export default SettingsValidator;