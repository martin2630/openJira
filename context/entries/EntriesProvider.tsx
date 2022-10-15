import axios from 'axios';
import { FC, useEffect, useReducer } from 'react';
import { entriesApi } from '../../apis';
import { Entry } from '../../interfaces';
import { EntriesContext, entriesReducer } from './';
import { useSnackbar } from 'notistack';
// import { v4 as uuidv4 } from 'uuid';

export interface EntriesState {
    entries: Entry[];
}


const Entries_INITIAL_STATE: EntriesState = {
    entries: [],
}


export const EntriesProvider:FC = ({ children }) => {
    const { enqueueSnackbar, } = useSnackbar();
    const [state, dispatch] = useReducer( entriesReducer , Entries_INITIAL_STATE );

    const addNewEntry = async ( description: string ) => {
        const { data } = await entriesApi.post<Entry>('/entries', { description });
        // const newEntry: Entry = {
        //     _id: uuidv4(),
        //     description,
        //     createdAt: Date.now(),
        //     status: 'pending'
        // }

        dispatch({ type: '[Entry] Add-Entry', payload: data });
    }

    const updateEntry = async( { _id, description, status } : Entry, showSnackBar = false ) => {
        try {
            const { data } = await entriesApi.put<Entry>(`/entries/${_id}`, { description, status } );
            dispatch({ type: '[Entry] Entry-Updated', payload: data });
        } catch (error) {
            console.log(error);
        }
        if(showSnackBar)
            enqueueSnackbar('se actualizó con éxito' , {
                variant: "success",
                autoHideDuration: 1500,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
    }

    const deleteEntry = async( _id: string) => {
        try {
            const { data } = await entriesApi.delete<Entry>(`/entries/${_id}` );
            dispatch({ type: '[Entry] Entry-Delated', payload: _id });
        } catch (error) {
            console.log(error);
        }
        enqueueSnackbar('se eliminó con éxito' , {
            variant: "success",
            autoHideDuration: 1500,
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
            }
        });
    }

    const refreshEntries = async() => {
      const { data }  = await entriesApi.get<Entry[]>('/entries');
      dispatch({ type: '[Entry] Refresh-Data', payload: data });
    }

    useEffect(()=>{
      refreshEntries();
    }, [])


    return (
        <EntriesContext.Provider value={{
            ...state,
            // Methods
            addNewEntry,
            updateEntry,
            deleteEntry,
        }}>
            { children }
        </EntriesContext.Provider>
    )
};