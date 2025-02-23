import { useEffect } from 'react';
import { useBeforeUnload, unstable_usePrompt as usePrompt } from 'react-router-dom';
import { TEXT } from '../constants/text';

export const useNavigationProtection = (shouldProtect) => {
  // Handle browser navigation (back/forward/reload)
  useBeforeUnload(
    shouldProtect
      ? (event) => {
          event.preventDefault();
          return TEXT.navigation.unsavedChanges;
        }
      : undefined
  );

  // Handle React Router navigation
  usePrompt({
    when: shouldProtect,
    message: TEXT.navigation.unsavedChanges
  });
};
