import { ChangeEvent, useMemo, useState, FC, useContext } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { capitalize, Card, Grid, CardHeader, CardContent, TextField, CardActions, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, IconButton } from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { isValidObjectId } from 'mongoose';

import { Layout } from "@/components/layouts";
import { Entry, EntryStatus } from '@/interfaces';
import { dbEntries } from '@/database';
import { EntriesContext } from '@/context/entries';
import { dateFunctions } from '@/utils';

const validStatus: EntryStatus[] = ['finished', 'in-progress', 'pending'];

interface Props {
    entry: Entry;
}

export const EntryPage: FC<Props> = ({ entry }) => {

    const { updateEntry, deleteEntry } = useContext(EntriesContext)
    const router = useRouter()

    const [inputValue, setInputValue] = useState(entry.description);
    const [status, setStatus] = useState<EntryStatus>(entry.status)
    const [touched, setTouched] = useState(false);

    //memorizar el valor de la validacion
    const isNotValid = useMemo(() => inputValue.length <= 0 && touched, [inputValue, touched])

    const onTextFieldChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value)
    }

    const onStatusChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setStatus(event.target.value as EntryStatus)
    }

    const onSave = () => {

        if (inputValue.trim().length <= 0) return

        const updatedEntry: Entry = {
            ...entry,
            description: inputValue,
            status
        }

        updateEntry(updatedEntry)
    }

    const onDelete = async() => {
        await deleteEntry(entry._id)
        router.push('/')
    }

    return (
        <Layout title={inputValue.substring(0, 20) + '...'}>
            <Grid
                container
                justifyContent="center"
                sx={{ marginTop: 2 }}
            >
                <Grid item xs={12} sm={8} md={6}>
                    <Card>
                        <CardHeader
                            title={`Entrada: ${inputValue}`}
                            subheader={`creada ${dateFunctions.formatDate(entry.createdAt)}`}
                        />

                        <CardContent>
                            <TextField
                                sx={{ marginTop: 2, marginBottom: 1 }}
                                fullWidth
                                label="Nueva Entrada"
                                multiline
                                autoFocus
                                placeholder='Nueva Entrada'
                                value={inputValue}
                                onChange={onTextFieldChanged}
                                onBlur={() => setTouched(true)}
                                helperText={isNotValid && 'Ingrese un valor'}
                                error={isNotValid}
                            />

                            <FormControl>
                                <FormLabel>Status:</FormLabel>
                                <RadioGroup
                                    row
                                    value={status}
                                    onChange={onStatusChanged}
                                >
                                    {
                                        validStatus.map((option) => (
                                            <FormControlLabel
                                                key={option}
                                                value={option}
                                                control={<Radio />}
                                                label={capitalize(option)}
                                            />
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>
                        </CardContent>

                        <CardActions>
                            <Button
                                startIcon={<SaveOutlinedIcon />}
                                variant="contained"
                                fullWidth
                                onClick={onSave}
                                disabled={inputValue.length <= 0}
                            >
                                Save
                            </Button>
                        </CardActions>

                    </Card>
                </Grid>

            </Grid>

            <IconButton
                sx={{ position: 'fixed', bottom: 30, right: 30, backgroundColor: 'error.dark' }}
                onClick={onDelete}
            >
                <DeleteOutlineOutlinedIcon />
            </IconButton>

        </Layout>
    )
}

// Path: pages\entries
export const getServerSideProps: GetServerSideProps = async ({ params }) => {

    const { id } = params as { id: string };

    const entry = await dbEntries.getEntryById(id)

    if (!entry) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            entry
        }
    }
}

export default EntryPage