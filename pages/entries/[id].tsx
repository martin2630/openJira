import React, { useState, ChangeEvent, useMemo, FC, useContext } from 'react';
import { Layout } from '../../components/layouts';
import {
  capitalize,
  Grid,
  Card,
  CardHeader,
  CardContent,
  TextField,
  CardActions,
  Button,
  FormControl,
  FormLabel, 
  FormControlLabel,
  RadioGroup,
  Radio,
  IconButton,
} from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { EntryStatus, Entry } from '../../interfaces';
import { DeleteOutlined } from '@mui/icons-material';
import { GetServerSideProps } from 'next';
import { dbEntries } from '../../database';
import { EntriesContext } from '../../context/entries';
import { dateFunctions } from '../../utils';

const entryStatus: EntryStatus[] = ['pending', 'in-progress', 'finished'];

interface Props{
  id: string;
  entry: Entry;
}

const EntryPage: FC<Props> = ({ entry }) => {
  const [inputValue, setInputValue] = useState(entry.description);
  const [status, setStatus] = useState<EntryStatus>(entry.status);
  const [touched, setTouched] = useState(false);
  const { updateEntry, deleteEntry } = useContext(EntriesContext);

  const isNotValid = useMemo(() => inputValue.length <= 0 && touched, [inputValue, touched])

  const onTextFieldChanged = ( event: ChangeEvent<HTMLInputElement> ) => {
    setInputValue( event.target.value );
  }

  const onStatusChanged = ( event: ChangeEvent<HTMLInputElement> ) => {
    setStatus( event.target.value as EntryStatus );
  }

  const onSave = () => {
    
    if (inputValue.trim().length === 0) return;

    const entryUpdated = {
      ...entry,
      status,
      description: inputValue,
    }
    updateEntry(entryUpdated, true);
  }

  const handleDelete = () => {
    deleteEntry(entry._id);
  }

    return (
      <Layout title='ID - OpenJira'>
        <Grid
          container
          justifyContent="center"
          sx={{marginTop: 2}}
        >
          <Grid item xs={12} sm={8} md={6}>
            <Card>
              <CardHeader
                title={`Entrada: ${inputValue}`}
                subheader={`Creada hace: ${dateFunctions.getFormatDistanceToNow(entry.createdAt)}`}
              />

              <CardContent>
                <TextField 
                  sx={{marginTop: 2, marginBottom: 1}}
                  fullWidth
                  placeholder="Nueva entrada"
                  multiline
                  autoFocus
                  label="Nueva entrada"
                  value={inputValue}
                  onBlur={() => setTouched(true)}
                  onChange={onTextFieldChanged}
                  helperText={ isNotValid && 'Ingrese un valor' }
                  error={ isNotValid }
                />

                <FormControl>
                  <FormLabel> Status: </FormLabel>
                  <RadioGroup
                    row
                    value={ status }
                    onChange={onStatusChanged}
                  >
                    {entryStatus.map(option => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio />}
                        label={capitalize(option)}
                      />

                    ))}
                  </RadioGroup>
                </FormControl>
              </CardContent>

              <CardActions>
                <Button
                  startIcon={ <SaveOutlinedIcon /> }
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
          sx={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            backgroundColor: 'error.dark'
          }}
          onClick={handleDelete}
        >
          <DeleteOutlined />
        </IconButton>

      </Layout>
    )
}


export const getServerSideProps: GetServerSideProps = async ({params}) => {
  const { id } = params;
  const entry = await dbEntries.getEntryById(id);

  if(!entry){
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }


  return {
    props: {
      id,
      entry,
    }, // will be passed to the page component as props
  }
}

export default EntryPage