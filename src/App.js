import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Alert from '@mui/material/Alert'

// Import Components
import TopBar from './components/TopBar/index'
import UserList from './components/UserList/index'
import UserDetail from './components/UserDetail/index'
import UserPhotos from './components/UserPhotos/index'

function App() {
  const [context, setContext] = useState('Home')

  return (
    <>
      <TopBar context={context} />
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12} sm={4} md={3}>
          <Paper elevation={3}>
            <UserList />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={8} md={9}>
          <Paper elevation={3} sx={{ p: 2, minHeight: '80vh' }}>
            <Routes>
              <Route
                path="/users/:userId"
                element={<UserDetail setContext={setContext} />}
              />

              <Route
                path="/photos/:userId"
                element={<UserPhotos setContext={setContext} />}
              />

              <Route
                path="/users"
                element={
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Select a user from the list to view details.
                  </Alert>
                }
              />

              <Route
                path="/"
                element={<Navigate to="/users" replace />}
              />

              <Route
                path="*"
                element={<Navigate to="/users" replace />}
              />
            </Routes>
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}

export default App