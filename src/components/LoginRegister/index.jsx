import React, { useState } from 'react'
import { Grid, Typography, TextField, Button, Alert, Paper, Box } from '@mui/material'

function LoginRegister({ onLoginChange }) {
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
        try {
            const response = await fetch('http://localhost:8081/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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

        } catch (err) {
            setLoginError(err.message)
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
            const response = await fetch('http://localhost:8081/user', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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

            setRegisterMessage({ type: 'success', text: "Registration successful! Please login." })
            setRegisterData({
                login_name: '', password: '', confirm_password: '',
                first_name: '', last_name: '', location: '', description: '', occupation: ''
            })

        } catch (err) {
            setRegisterMessage({ type: 'error', text: err.message || "Registration failed" })
        }
    }

    return (
        <Grid container spacing={2} sx={{ padding: 4, justifyContent: 'center' }}>
            <Grid item xs={12} md={5}>
                <Paper elevation={3} sx={{ padding: 3 }}>
                    <Typography variant="h5" gutterBottom>Login</Typography>
                    {loginError && <Alert severity="error" sx={{ mb: 2 }}>{loginError}</Alert>}

                    <form onSubmit={handleLogin}>
                        <TextField
                            label="Login Name"
                            fullWidth
                            margin="normal"
                            value={loginName}
                            onChange={(e) => setLoginName(e.target.value)}
                            required
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                            Login
                        </Button>
                    </form>
                </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ padding: 3 }}>
                    <Typography variant="h5" gutterBottom>Register New User</Typography>

                    {registerMessage.text && (
                        <Alert severity={registerMessage.type} sx={{ mb: 2 }}>
                            {registerMessage.text}
                        </Alert>
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

                        <Button type="submit" variant="contained" color="success" fullWidth sx={{ mt: 2 }}>
                            Register Me
                        </Button>
                    </form>
                </Paper>
            </Grid>

        </Grid>
    )
}

export default LoginRegister