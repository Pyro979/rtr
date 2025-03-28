// Regular expression to extract tags from square brackets and hashtags
export const TAG_REGEX = /\[(.*?)\]|#(\w+)/g;

// Function to extract tags from table name
export const extractTags = (name) => {
  const tags = [];
  let match;
  const regex = new RegExp(TAG_REGEX);
  while ((match = regex.exec(name)) !== null) {
    tags.push(match[1] || match[2]);
  }
  return tags;
};

// Function to check if a table with the same name already exists
// Only compares the exact trimmed name (no tag or folder processing)
export const isDuplicateName = (tables, newTableName, currentTableId = null) => {
  // Only trim the name, no other processing
  const trimmedNewName = newTableName.trim();
  
  // Check if any existing table has the exact same name
  return tables.some(table => {
    // Skip the current table being edited if an ID is provided
    if (currentTableId && table.id === currentTableId) {
      return false;
    }
    
    // Compare the exact trimmed names
    return table.name.trim() === trimmedNewName;
  });
};
