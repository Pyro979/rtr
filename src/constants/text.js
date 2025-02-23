export const TEXT = {
  app: {
    title: 'RtR: Random Table Roller',
    subtitle: 'for D&D and other TTRPGs',
    description: 'Create, manage, and roll on custom random tables for your tabletop roleplaying games.'
  },
  sidebar: {
    title: 'Random Table Roller',
    importButton: 'Import Table'
  },
  import: {
    title: 'Import Table',
    nameLabel: 'Table Name',
    namePlaceholder: 'Enter table name...',
    contentPlaceholder: 'Enter table items, one per line...',
    submitButton: 'Import',
    errors: {
      nameRequired: 'Table name is required',
      itemsRequired: 'At least one item is required'
    }
  },
  edit: {
    title: 'Edit Table',
    contentPlaceholder: 'Enter table items, one per line...',
    saveButton: 'Save Changes',
    deleteButton: 'Delete Table',
    errors: {
      nameRequired: 'Table name is required',
      itemsRequired: 'At least one item is required'
    }
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
  },
  navigation: {
    unsavedChanges: 'You have unsaved changes. Are you sure you want to leave?'
  }
};
