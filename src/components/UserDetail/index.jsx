import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    Card, CardContent, Typography, Button, Dialog, DialogTitle,
    DialogContent, TextField, DialogActions, Box
} from '@mui/material'
import fetchModel from '../../lib/fetchModelData'
import { BE_URL } from '../../lib/config'

function UserDetail({ setContext, currentUser }) {
    const { userId } = useParams()
    const [user, setUser] = useState(null)

    const [openEdit, setOpenEdit] = useState(false)

    const [editData, setEditData] = useState({
        first_name: '',
        last_name: '',
        location: '',
        description: '',
        occupation: ''
    })

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await fetchModel(`/user/${userId}`)
                setUser(data)

                setEditData({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    location: data.location || '',
                    description: data.description || '',
                    occupation: data.occupation || ''
                })

                if (setContext) setContext(`${data.first_name} ${data.last_name}`)
            } catch (error) {
                console.error("Error:", error)
            }
        }
        fetchUserData()
    }, [userId, setContext])

    const handleUpdateUser = async () => {
        try {
            const res = await fetch(`${BE_URL}/user/${user._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(editData)
            })
            if (!res.ok) throw new Error("Update failed")

            const updatedUser = await res.json()
            setUser(updatedUser)
            setOpenEdit(false)
        } catch (err) {
            alert(err.message)
        }
    }

    if (!user) return <Typography p={2}>Loading...</Typography>

    const isOwnProfile = currentUser && currentUser._id === user._id

    return (
        <>
            <Card variant="outlined" sx={{ margin: 'auto', maxWidth: 600, mt: 4 }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>{user.first_name} {user.last_name}</Typography>
                    <Typography color="text.secondary" variant="h6">{user.occupation}</Typography>
                    <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>"{user.description}"</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}><strong>Location:</strong> {user.location}</Typography>

                    <Box display="flex" gap={2}>
                        <Button variant="contained" component={Link} to={`/photos/${user._id}`}>View Photos</Button>
                        {isOwnProfile && (
                            <Button variant="outlined" onClick={() => setOpenEdit(true)}>Edit Profile</Button>
                        )}
                    </Box>
                </CardContent>
            </Card>

            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit Profile</DialogTitle>

                <DialogContent>
                    <Box
                        component="form"
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 1 }}
                    >
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="First Name"
                                fullWidth
                                margin="dense"
                                value={editData.first_name}
                                onChange={e => setEditData({ ...editData, first_name: e.target.value })}
                            />
                            <TextField
                                label="Last Name"
                                fullWidth
                                margin="dense"
                                value={editData.last_name}
                                onChange={e => setEditData({ ...editData, last_name: e.target.value })}
                            />
                        </Box>

                        <TextField
                            label="Occupation"
                            fullWidth
                            margin="dense"
                            value={editData.occupation}
                            onChange={e => setEditData({ ...editData, occupation: e.target.value })}
                        />

                        <TextField
                            label="Location"
                            fullWidth
                            margin="dense"
                            value={editData.location}
                            onChange={e => setEditData({ ...editData, location: e.target.value })}
                        />

                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            margin="dense"
                            value={editData.description}
                            onChange={e => setEditData({ ...editData, description: e.target.value })}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ padding: 3 }}>
                    <Button onClick={() => setOpenEdit(false)} color="secondary">Cancel</Button>
                    <Button variant="contained" onClick={handleUpdateUser}>Save Changes</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default UserDetail