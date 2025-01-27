/* eslint-disable */
import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchField({ style, placeholder, inputProps }) {
	return (
		<Paper
			elevation={1}
			component="form"
			sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
			style={style}
		>
			<IconButton
				sx={{ p: '10px' }}
				aria-label="menu"
			>
				<SearchIcon />
			</IconButton>
			<InputBase
				sx={{ ml: 1, flex: 1 }}
				placeholder={placeholder}
				inputProps={inputProps}
				size="small"
			/>
			<IconButton
				type="button"
				sx={{ p: '10px' }}
				aria-label="search"
			/>
		</Paper>
	);
}
