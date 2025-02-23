import { useBeforeUnload } from 'react-router-dom';
import { TEXT } from '../constants/text';

export const useNavigationProtection = (shouldProtect) => {
  useBeforeUnload(
    shouldProtect
      ? (event) => {
          event.preventDefault();
          return TEXT.navigation.unsavedChanges;
        }
      : undefined
  );
};
