import React, { useState } from 'react'
import { Grid, Typography, TextField, Button, Alert, Paper, Box, Link } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { BE_URL } from '../../lib/config'

function LoginRegister({ onLoginChange }) {
    const navigate = useNavigate()
    const location = useLocation()
    
    const isLoginView = location.pathname === '/login'

    const [loginName, setLoginName] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [loginError, setLoginError] = useState('')

    const [registerData, setRegisterData] = useState({
        login_name: '',
        password: '',
        confirm_password: '',
        first_name: '',
        last_name: '',
        location: '',
        description: '',
        occupation: ''
    })
    const [registerMessage, setRegisterMessage] = useState({ type: '', text: '' })

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoginError('')
        try {
            const response = await fetch(`${BE_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    login_name: loginName,
                    password: loginPassword
                }),
                credentials: 'include',
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.message || 'Login failed')
            }

            const user = await response.json()
            onLoginChange(user)

        } catch (error) {
            setLoginError(error.message)
        }
    }

    const handleRegisterInput = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value })
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setRegisterMessage({ type: '', text: '' })

        if (registerData.password !== registerData.confirm_password) {
            setRegisterMessage({ type: 'error', text: "Passwords do not match!" })
            return
        }

        try {
            const response = await fetch(`${BE_URL}/user`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    login_name: registerData.login_name,
                    password: registerData.password,
                    first_name: registerData.first_name,
                    last_name: registerData.last_name,
                    location: registerData.location,
                    description: registerData.description,
                    occupation: registerData.occupation
                }),
                credentials: 'include'
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.message || 'Registration failed')
            }

            alert("Registration successful! Switching to login...")
            
            setRegisterData({
                login_name: '', password: '', confirm_password: '',
                first_name: '', last_name: '', location: '', description: '', occupation: ''
            })

            navigate('/login') 

        } catch (err) {
            setRegisterMessage({ type: 'error', text: err.message || "Registration failed" })
        }
    }

    return (
        <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '60vh' }}>
            <Grid item xs={12} sm={8} md={5}>
                <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
                    
                    {isLoginView ? (
                        <Box>
                            <Typography variant="h4" align="center" gutterBottom fontWeight="bold" color="primary">
                                Login
                            </Typography>
                            
                            {registerMessage.type === 'success' && (
                                <Alert severity="success" sx={{ mb: 2 }}>{registerMessage.text}</Alert>
                            )}
                            
                            {loginError && <Alert severity="error" sx={{ mb: 2 }}>{loginError}</Alert>}

                            <form onSubmit={handleLogin}>
                                <TextField
                                    label="Login Name" fullWidth margin="normal"
                                    value={loginName} onChange={(e) => setLoginName(e.target.value)} required
                                />
                                <TextField
                                    label="Password" type="password" fullWidth margin="normal"
                                    value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required
                                />
                                <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 3, mb: 2 }}>
                                    Sign In
                                </Button>
                            </form>

                            <Box textAlign="center" mt={2}>
                                <Typography variant="body2">
                                    Don't have an account?{' '}
                                    <Link 
                                        component="button" variant="body2"
                                        onClick={() => {
                                            navigate('/register')
                                            setLoginError('')
                                        }}
                                        sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                        Register here
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    ) : (
                        <Box>
                            <Typography variant="h4" align="center" gutterBottom fontWeight="bold" color="primary">
                                Register
                            </Typography>

                            {registerMessage.text && registerMessage.type === 'error' && (
                                <Alert severity="error" sx={{ mb: 2 }}>{registerMessage.text}</Alert>
                            )}

                            <form onSubmit={handleRegister}>
                                <TextField name="login_name" label="Login Name *" fullWidth margin="dense" value={registerData.login_name} onChange={handleRegisterInput} required />

                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <TextField name="first_name" label="First Name *" fullWidth margin="dense" value={registerData.first_name} onChange={handleRegisterInput} required />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField name="last_name" label="Last Name *" fullWidth margin="dense" value={registerData.last_name} onChange={handleRegisterInput} required />
                                    </Grid>
                                </Grid>
                                
                                <TextField name="password" label="Password *" type="password" fullWidth margin="dense" value={registerData.password} onChange={handleRegisterInput} required />
                                <TextField name="confirm_password" label="Confirm Password *" type="password" fullWidth margin="dense" value={registerData.confirm_password} onChange={handleRegisterInput} required />
                                
                                <TextField name="occupation" label="Occupation" fullWidth margin="dense" value={registerData.occupation} onChange={handleRegisterInput} />
                                <TextField name="location" label="Location" fullWidth margin="dense" value={registerData.location} onChange={handleRegisterInput} />
                                <TextField name="description" label="Description" fullWidth margin="dense" multiline rows={2} value={registerData.description} onChange={handleRegisterInput} />

                                <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ mt: 3, mb: 2 }}>
                                    Register Me
                                </Button>
                            </form>

                            <Box textAlign="center" mt={2}>
                                <Typography variant="body2">
                                    Already have an account?{' '}
                                    <Link 
                                        component="button" variant="body2"
                                        onClick={() => {
                                            navigate('/login')
                                            setRegisterMessage({ type: '', text: '' })
                                        }}
                                        sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                        Back to Login
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Grid>
        </Grid>
    )
}

export default LoginRegister