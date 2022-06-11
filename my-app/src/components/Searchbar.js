import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Card, CardContent, Typography, CardActions } from '@material-ui/core';
import { useState } from 'react';

function Searchbar() {
	const [search, setSearch] = useState("");

	return (
		<Card style={{marginBottom: '30px'}}>
			<CardContent>
				<Typography>Search a Keyword</Typography>
				<TextField style={{width: '50%'}} id="searchKeyword" label="Search a phrase or keyword..." variant="outlined" value={search} onChange={(e) => setSearch(e.target.value)}/>
			</CardContent>
		</Card>
	)
}

export default Searchbar;