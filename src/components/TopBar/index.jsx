import React from 'react'
import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

function TopBar({ context, user, setUser }) {
    const navigate = useNavigate()
    const handleLogout = async () => {
        try {
            await fetch('http://localhost:8081/admin/logout', {
                method: 'POST',
                credentials: 'include',
            })
            setUser(null)
            navigate('/')
        } catch (err) {
            console.error('Logout failed', err)
            setUser(null)
            navigate('/login')
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Jayce Dang Photo App
                    </Typography>

                    <Typography variant="h6" component="div" sx={{ marginRight: 2 }}>
                        {context}
                    </Typography>

                    {user ? (
                        <>
                            <Typography variant="h6" sx={{ marginRight: 2 }}>
                                Hi {user.first_name}
                            </Typography>

                            <Button color="inherit" component={Link} to="/upload" sx={{ marginRight: 1, border: '1px solid white' }}>
                                Upload new Photo
                            </Button>

                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Typography variant="h6">Please Login</Typography>
                    )}

                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default TopBar