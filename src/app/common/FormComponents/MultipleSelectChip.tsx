/* eslint-disable */
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import { makeStyles } from '@mui/styles';
import { Cancel, Opacity } from '@mui/icons-material';

// @ts-ignore
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row', // Change this to 'row' for horizontal alignment
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgb(17, 24, 39)',
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: '16px',
    whiteSpace: 'nowrap',
  },
  deleteIcon: {
    '& > *': {
      color: '#f44336',
      opacity: '0.8',
      transition: 'opacity 0.2s ease',
    },
    '& > *:hover': {
      opacity: '1',
    },
  },
}));

interface MultipleSelectChipProps {
  chips: string[];
  onAdd: (chip: string) => void;
  onDelete: (chip: string) => void;
  disabled?: boolean;
  placeholder?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
}

const MultipleSelectChip: React.FC<MultipleSelectChipProps> = ({
  chips = [],
  onAdd,
  onDelete,
  disabled = false,
  placeholder = 'Enter a value and press Enter',
  fullWidth = false,
  size = 'medium',
}) => {
  const classes = useStyles();
  const [inputValue, setInputValue] = React.useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleEnterKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      onAdd(inputValue);
      setInputValue('');
      event.preventDefault();
    }
  };

  return (
    <div className={classes.root}>
      <TextField
        className='!m-0'
        value={inputValue}
        onChange={handleChange}
        onKeyPress={handleEnterKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        fullWidth={fullWidth}
        size={size}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              {chips.length > 0 && <span>Tags:</span>}
            </InputAdornment>
          ),
        }}
      />
      {chips.map((chip) => (
        <Chip
          key={chip}
          label={chip}
          onDelete={() => onDelete(chip)}
          disabled={disabled}
          className={classes.chip}
          deleteIcon={<Cancel className={classes.deleteIcon} />}
        />
      ))}
    </div>
  );
};

export default MultipleSelectChip;
