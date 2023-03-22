import { DragEvent, FC, useContext, useMemo } from 'react';
import { Paper, List } from "@mui/material";

import { EntryStatus } from "@/interfaces";
import { EntryCard } from "./EntryCard";
import { EntriesContext } from '@/context/entries';
import { UIContext } from '@/context/ui';

import styles from './EntryList.module.css'

interface Props {
    status: EntryStatus
}

export const EntryList: FC<Props> = ({ status }) => {

    const { entries, updateEntry } = useContext(EntriesContext)
    const { isDragging, endDragging } = useContext( UIContext )

    //Memorizo, con dependecia solo en las entries
    const entriesByStatus = useMemo( () => entries.filter( entry => entry.status === status ), [entries]) 

    const allowDrop = (event:DragEvent<HTMLDivElement>) => {
        event.preventDefault()
    }

    const onDropEntry = (event:DragEvent<HTMLDivElement>) => {
        const id = event.dataTransfer.getData('text')
        
        //Actualizar el estado de la entrada
        const entry = entries.find( e => e._id === id)!
        entry.status = status
        updateEntry(entry)
        endDragging()
    }
    
    return (
        <div
            onDrop={onDropEntry}
            onDragOver={allowDrop}
            className={isDragging ? styles.dragging : ''}
        >
            <Paper
                sx={{
                    height: "calc(100vh - 250px)",
                    overflowY: "scroll",
                    "&::-webkit-scrollbar": {
                        width: "3px",
                        bgcolor: "#454545",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: "#4a148c",
                        border: "7px none #fffff",
                        borderRadius: "10px",
                    },
                    padding: '1px, 5px'
                }}
            >
                <List sx={{ opacity: isDragging ? 0.2 : 1, transition: 'all .3s' }}>
                    {
                        entriesByStatus.map( entry => (
                            <EntryCard key={entry._id} entry={entry}/>
                        ))
                    }

                </List>
            </Paper>
        </div>
    );
};