import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Alert from '@mui/material/Alert'

import TopBar from './components/TopBar'
import UserList from './components/UserList'
import UserDetail from './components/UserDetail'
import UserPhotos from './components/UserPhotos'
import LoginRegister from './components/LoginRegister'
import ProtectedRoute from './components/ProtectedRoute'
import PhotoAdd from './components/PhotoAdd'

function App() {
    const [context, setContext] = useState('Home')
    const [user, setUser] = useState(null)

    return (
        <>
            <TopBar context={context} user={user} setUser={setUser} />
            <Routes>
                <Route path="/login" element={
                    user ? <Navigate to={`/users/${user._id}`} replace /> : (
                        <Grid container spacing={2} sx={{ p: 2 }}>
                            <Grid item xs={12}>
                                <LoginRegister onLoginChange={setUser} />
                            </Grid>
                        </Grid>
                    )
                } />
                <Route path="/register" element={
                    user ? <Navigate to="/" replace /> : (
                        <Grid container spacing={2} sx={{ p: 2 }}>
                            <Grid item xs={12}>
                                <LoginRegister onLoginChange={setUser} />
                            </Grid>
                        </Grid>
                    )
                } />
                <Route path="/*" element={
                    <ProtectedRoute userLoggedIn={user}>
                        <Grid container spacing={2} sx={{ p: 2 }}>
                            <Grid item xs={12} sm={4} md={3}>
                                <Paper elevation={3}><UserList /></Paper>
                            </Grid>

                            <Grid item xs={12} sm={8} md={9}>
                                <Paper elevation={3} sx={{ p: 2, minHeight: '80vh' }}>
                                    <Routes>
                                        <Route path="/users/:userId" element={<UserDetail setContext={setContext} currentUser={user} />} />
                                        <Route path="/photos/:userId" element={<UserPhotos setContext={setContext} currentUser={user} />} />
                                        <Route path="/upload" element={<PhotoAdd />} />
                                        <Route path="/users" element={<Alert severity="info" sx={{ mt: 2 }}>Select a user from the list.</Alert>} />
                                        
                                        <Route path="/" element={<Navigate to="/users" replace />} />
                                        <Route path="*" element={<Navigate to="/users" replace />} />
                                    </Routes>
                                </Paper>
                            </Grid>
                        </Grid>
                    </ProtectedRoute>
                } />
            </Routes>
        </>
    )
}

export default App