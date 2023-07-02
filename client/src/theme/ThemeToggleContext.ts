import { createContext, Dispatch, SetStateAction } from 'react';

export const ThemeToggleContext = createContext<null | boolean>(null);

export const ThemeToggleDispatchContext = createContext<null | Dispatch<
  SetStateAction<boolean>
>>(null);
