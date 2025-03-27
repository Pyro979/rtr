export const TEXT = {
  app: {
    title: 'RtR: Random Table Roller',
    subtitle: 'for D&D and other TTRPGs',
    description: '<p>Create, manage, and roll on custom random tables for your tabletop roleplaying games. <br/>' +
                  'All storage is handled client-side in your <b>browser</b>, so no account is needed. </p>' +
                  '<p>Checkout <a href="https://www.reddit.com/r/d100/" target="_blank">r/d100</a> and <a href="https://www.reddit.com/r/BehindTheTables/" target="_blank">r/BehindTheTables</a> for lots of crowd-sourced tables. <br/> See DMsGuild for my <a href="https://www.dmsguild.com/browse.php?author=Yuriy%20Shikhanovich&page=1&sort=6a&affiliate_id=3307266" target="_blank">published adventures</a>.</p>' +
                  '<p>If you have any feedback or questions, reach out on <a href="https://github.com/Pyro979/rtr" target="_blank">GitHub</a > or <a href="mailto:app@uxiomatic.com">app@uxiomatic.com</a>.</p>'
  },
  sidebar: {
    title: 'RtR: Random Table Roller',
    importButton: 'Import Table',
    optionsButton: 'Options'
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
      removeDuplicatesCount: 'Remove duplicates ({count})',
      removeHeader: 'Remove header',
      headerRemoved: '(header removed)'
    },
    errors: {
      nameRequired: 'Table name is required',
      itemsRequired: 'At least one item is required'
    },
    success: {
      created: 'Created a new table with {count} items:',
      clearButton: 'Clear'
    },
    organization: {
      title: 'Organization Tips:',
      folders: 'Use folder\\table_name format to organize tables in folders',
      tags: 'Use #tag or [tag] in table name to add tags for filtering',
      example: 'Example: "Dungeons\\Traps #combat [hazard]"'
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
    rolledPrefix: 'Rolled:',
    copyTooltip: 'Copy result to clipboard',
    styles: {
      normal: 'Normal Roll',
      weighted: 'Weighted  (Less Common Repeats)',
      noRepeat: 'No Repeat'
    },
    rollCount: {
      singular: 'time',
      plural: 'times'
    },
    floatingButton: {
      roll: 'Roll (r)',
      done: 'Done'
    }
  },
  errors: {
    tableNotFound: 'Table not found',
    rollFailed: 'Failed to roll on table',
    noTablesFound: 'No tables match "{searchTerm}"'
  },
  navigation: {
    unsavedChanges: 'You have unsaved changes. Are you sure you want to leave?'
  },
  search: {
    placeholder: 'Search tables...',
    clearAriaLabel: 'Clear search'
  },
  resetData: {
    title: 'Reset All Data',
    warning: 'WARNING: This will delete ALL tables and roll history!',
    confirmMessage: 'Only the default table will remain. This action cannot be undone.',
    typeInstruction: 'Type "DELETE ALL DATA" to confirm:',
    confirmButton: 'Reset All Data',
    cancelButton: 'Cancel',
    confirmText: 'DELETE ALL DATA'
  }
};
