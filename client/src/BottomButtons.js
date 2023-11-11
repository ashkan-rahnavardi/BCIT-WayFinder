import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Box } from '@mui/material';


export default function BottomButtons() {
  return (
    <Box display="flex" justifyContent="space-evenly" alignItems="center">
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
            <Button>One</Button>
            <Button>Two</Button>
            <Button>Three</Button>
        </ButtonGroup>
    </Box>
  );
}
