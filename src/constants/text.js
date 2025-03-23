export const TEXT = {
  app: {
    title: 'RtR: Random Table Roller',
    subtitle: 'for D&D and other TTRPGs',
    description: 'Create, manage, and roll on custom random tables for your tabletop roleplaying games. <br/> Checkout <a href="https://www.reddit.com/r/d100/">r/d100</a> and <a href="https://www.reddit.com/r/BehindTheTables/">r/BehindTheTables</a> for lots of crowd-sourced tables. <br/> See DMs Guild for my <a href="https://www.dmsguild.com/browse.php?author=Yuriy%20Shikhanovich&page=1&sort=6a&affiliate_id=3307266" target="_blank">published adventures</a>.'
  },
  sidebar: {
    title: 'RtR: Random Table Roller',
    importButton: '➕ Import Table'
  },
  import: {
    title: 'Import Table',
    nameLabel: 'Table Name',
    namePlaceholder: 'Enter table name...',
    contentPlaceholder: 'Enter table items, one per line...',
    submitButton: 'Import',
    preferences: {
      removeLeadingNumbers: 'Remove leading numbers',
      removeBulletPoints: 'Remove bullet points',
      removeDuplicates: 'Remove duplicates',
      removeHeader: 'Remove header'
    },
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
    duplicateButton: 'Duplicate',
    confirmDelete: 'Are you sure you want to delete this table?',
    errors: {
      nameRequired: 'Table name is required',
      itemsRequired: 'Table must have at least one item'
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
