import React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

function TopBar({ context }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Jayce Dang
          </Typography>
          <Typography variant="h6" component="div">
            {context}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default TopBar