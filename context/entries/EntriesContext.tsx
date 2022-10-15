import { createContext } from 'react';
import { Entry } from '../../interfaces';


interface ContextProps {
    entries: Entry[];

    // Methods
    addNewEntry: (description: string) => void;
    updateEntry: (entry: Entry, showSnackBar?: boolean | undefined) => void;
    RefreshEntry: (entries: Entry[]) => void;
    deleteEntry: (id: string) => void;
}


export const EntriesContext = createContext({} as ContextProps );