import { FC, useReducer, PropsWithChildren, useEffect } from 'react'
import { useSnackbar } from 'notistack';

import { Entry } from '@/interfaces'
import { EntriesContext, EntriesReducer } from './'
import { entriesApi } from '@/apis';

export interface EntriesState {
    entries: Entry[]
}

const Entries_INITIAL_STATE: EntriesState = {
    entries: [ ]
}

export const EntriesProvider: FC<PropsWithChildren> = ({ children }) => {

    const [state, dispatch] = useReducer(EntriesReducer, Entries_INITIAL_STATE)
    const { enqueueSnackbar } = useSnackbar();

    const addNewEntry = async(description: string) => {
        const { data } = await entriesApi.post<Entry>('/entries', { description })
        dispatch({ type: '[Entry] - Add-Entry', payload: data })
    }

    const deleteEntry = async(id: string) => {
        await entriesApi.delete(`/entries/${id}`)
        dispatch({ type: '[Entry] - Delete-Entry', payload: id })
    }

    const updateEntry = async( { _id, description, status }: Entry) => {
        try {
            const { data } = await entriesApi.put<Entry>(`/entries/${_id}`, { description, status } )
            dispatch({ type: '[Entry] - Updated-Entry', payload: data})

            enqueueSnackbar('Entry updated', {
                variant: 'success',
                autoHideDuration: 1500,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right'
                }
            })

        } catch (error) {
            console.log(error)
        }
    }

    const refreshEntries = async() => {
        const { data } = await entriesApi.get<Entry[]>('/entries')
        dispatch({ type: '[Entry] - Refresh-Data', payload: data })
    }

    useEffect(() => {
        refreshEntries()
    }, [])
    

    return (
        <EntriesContext.Provider value={{
            ...state,

            //Methods
            addNewEntry,
            updateEntry,
            deleteEntry
        }}>

            {children}
        </EntriesContext.Provider>
    )
}