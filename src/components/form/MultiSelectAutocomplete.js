import { useState } from 'react'
import { TextField, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'

const filter = createFilterOptions();

function MultiSelectAutocomplete({ options, keys }) {
    const initialDialogValue = keys.reduce((accumulator, value) => {
        return { ...accumulator, [value]: '' }
    }, {})

    const mainKey = keys[0]

    const [open, toggleOpen] = useState(false)
    const [dialogValue, setDialogValue] = useState(initialDialogValue)

    const handleClose = () => {
        setDialogValue(initialDialogValue)
        toggleOpen(false)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(dialogValue)

        handleClose()
    };

    return (
        <>
            <Autocomplete
                multiple
                fullWidth
                id="participants"
                name="participants"
                options={options}
                getOptionLabel={(option) => {
                    // e.g value selected with enter, right from the input
                    if (typeof option === "string") {
                        return option
                    }
                    if (option.inputValue) {
                        return option.inputValue
                    }
                    return option[mainKey]
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    if (params.inputValue !== "") {
                        filtered.push({
                            inputValue: params.inputValue,
                            [mainKey]: `Add "${params.inputValue}"`
                        });
                    }

                    return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                renderOption={(props, option) => (
                    <li
                        {...props}
                        {...(option[mainKey].indexOf("Add") >= 0 && {
                            onClick: () => {
                                toggleOpen(true)
                                setDialogValue({
                                    ...dialogValue,
                                    [mainKey]: option.inputValue,
                                })
                            }
                        })}
                    >
                        {option[mainKey]}
                    </li>
                )}
                freeSolo
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Participants"
                    />
                )}
            />
            <Dialog open={open} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>Add New Participant</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Did you miss someone? Please, add them!
                        </DialogContentText>
                        <Stack spacing={2} paddingBottom={2}>
                            {keys.map(key => (
                                <TextField
                                    key={key}
                                    autoFocus
                                    margin="dense"
                                    id={key}
                                    value={dialogValue[key]}
                                    onChange={(event) =>
                                        setDialogValue({
                                            ...dialogValue,
                                            [key]: event.target.value
                                        })
                                    }
                                    label={key}
                                    type="text"
                                    variant="standard"
                                />
                            ))}
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Add</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}

export default MultiSelectAutocomplete