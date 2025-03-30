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
      itemsRequired: 'At least one item is required',
      duplicateName: 'A table with this name already exists. Please use a different name or add tags/folders to make it unique.',
      invalidJson: 'Invalid JSON format. Please check your file and try again.',
      duplicatesInFile: 'Duplicate table names found in import file and removed:'
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
    },
    jsonImport: {
      title: 'Import JSON Tables',
      fileInputLabel: 'Select JSON file',
      dragDropText: 'To import tables: Drag & drop a JSON file here, or click to select.',
      dragDropText2: 'This will add to (or optionally overwrite) to your existing tables.',
      previewTitle: 'Tables to Import',
      itemCount: '{count} items',
      duplicatesFound: 'Duplicate tables found',
      overrideLabel: 'Override',
      toggleAllLabel: 'Toggle All',
      importSelectedButton: 'Import Selected',
      cancelButton: 'Cancel'
    },
    exportJson: {
      button: 'Export Tables',
      allTablesTitle: 'Export All Tables',
      selectedTablesTitle: 'Export Selected Tables',
      filename: 'random-tables.json'
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
    noRepeatCount: {
      format: '{rolled}/{total} rolled'
    },
    floatingButton: {
      roll: 'Roll (r)',
      done: 'Done'
    },
    condenseOption: {
      label: 'Condense Duplicates',
      tooltip: 'Show consecutive duplicate rolls as a single entry with range'
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
  },
  options: {
    title: 'Options',
    backButton: '← Back',
    sections: {
      importExport: {
        title: 'Import & Export',
        export: {
          title: 'Export Tables',
          description: 'Export all your tables to a JSON file for backup or sharing.',
          button: 'Export Tables'
        }
      },
      dataManagement: {
        title: 'Data Management',
        resetAllData: {
          title: 'Reset All Data',
          description: 'Delete all tables and roll history. This action cannot be undone.',
          button: 'Reset All Data',
          prompt: {
            title: 'Reset All Data',
            warning: '⚠️ WARNING: This will delete ALL tables and roll history!',
            confirmMessage: 'Only the default table will remain. This action cannot be undone.',
            typeInstruction: 'Type "DELETE ALL DATA" to confirm:',
            confirmButton: 'Reset All Data',
            cancelButton: 'Cancel',
            confirmText: 'DELETE ALL DATA'
          }
        }
      },
      artCredits: {
        title: 'Art Credits'
      }
    },
    importSuccess: 'Successfully imported {count} tables'
  }
};
