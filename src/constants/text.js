export const TEXT = {
  app: {
    title: 'RtR: Random Table Roller',
    subtitle: 'for D&D and other TTRPGs',
    description: 'Create, manage, and roll on custom random tables for your tabletop roleplaying games.'
  },
  sidebar: {
    title: 'Your Tables',
    importButton: 'Import New Table'
  },
  import: {
    title: 'Import Table',
    nameLabel: 'Table Name',
    namePlaceholder: 'Enter a name for your table',
    contentPlaceholder: 'Paste your table items here, one per line',
    submitButton: 'Import Table',
    errors: {
      nameRequired: 'Table name is required',
      itemsRequired: 'At least one item is required'
    }
  },
  edit: {
    title: 'Edit Table',
    contentPlaceholder: 'Edit your table items here, one per line',
    saveButton: 'Save Changes',
    deleteButton: 'Delete Table'
  },
  roll: {
    title: 'Roll Table',
    rollButton: 'Roll',
    resetButton: 'Reset History',
    styles: {
      normal: 'Normal',
      weighted: 'Weighted',
      noRepeat: 'No Repeat'
    }
  },
  errors: {
    tableNotFound: 'Table not found',
    rollFailed: 'Failed to roll on table'
  }
};
