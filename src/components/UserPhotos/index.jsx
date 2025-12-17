import React, { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    Card, CardContent, CardHeader, Typography, Divider, Avatar, Box, Alert, CircularProgress,
    IconButton, TextField, Button
} from '@mui/material'
import { red } from '@mui/material/colors'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'

import fetchModel from '../../lib/fetchModelData'
import { BE_URL } from '../../lib/config'

function UserPhotos({ setContext, currentUser }) {
    const { userId } = useParams()
    const [photos, setPhotos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [commentInputs, setCommentInputs] = useState({})

    const dateTimeFormatter = useMemo(() => new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium', timeStyle: 'short',
    }), [])

    const loadData = async () => {
        try {
            const [userData, photosData] = await Promise.all([
                fetchModel(`/user/${userId}`),
                fetchModel(`/photosOfUser/${userId}`)
            ])
            if (userData) setContext(`Photos of ${userData.first_name} ${userData.last_name}`)
            setPhotos(photosData)
        } catch (err) {
            console.error("Error:", err)
            setError("Could not load photos.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [userId])

    const handleDeletePhoto = async (photoId) => {
        if (!window.confirm("Are you sure you want to delete this photo?")) return
        try {
            const response = await fetch(`${BE_URL}/photos/${photoId}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error("Server error: " + response.status)
            }

            setPhotos(photos.filter(p => p._id !== photoId))
        } catch (err) {
            console.error(err)
            alert("Failed to delete photo: " + err.message)
        }
    }

    const handleCommentSubmit = async (photoId) => {
        const commentText = commentInputs[photoId]
        if (!commentText || !commentText.trim()) return

        try {
            await fetch(`${BE_URL}/comment/commentsOfPhoto/${photoId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ comment: commentText })
            })

            setCommentInputs({ ...commentInputs, [photoId]: '' })
            loadData()
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
    if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
    if (!photos || photos.length === 0) return <Alert severity="info" sx={{ m: 2 }}>No photos found.</Alert>

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
            {photos.map((photo) => (
                <Card key={photo._id} variant="outlined" sx={{ marginBottom: 4 }}>
                    <CardHeader
                        avatar={<Avatar sx={{ bgcolor: red[500] }}>P</Avatar>}
                        action={
                            (currentUser && currentUser._id === photo.user_id) && (
                                <IconButton onClick={() => handleDeletePhoto(photo._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            )
                        }
                        title={dateTimeFormatter.format(new Date(photo.date_time))}
                        subheader={photo.file_name}
                    />

                    <CardContent>
                        <Box
                            component="img"
                            src={`${BE_URL}/images/${photo.file_name}`}
                            alt={photo.file_name}
                            sx={{ width: '100%', height: 'auto', display: 'block', mb: 2, borderRadius: 1, objectFit: 'contain', maxHeight: '500px' }}
                        />

                        <Divider sx={{ my: 2 }}>Comments</Divider>

                        {photo.comments?.map((comment) => (
                            <Box key={comment._id} sx={{ mb: 2, bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
                                <Typography variant="subtitle2" component="span" fontWeight="bold">
                                    <Link to={`/users/${comment.user._id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                                        {comment.user.first_name} {comment.user.last_name}
                                    </Link>
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                    {dateTimeFormatter.format(new Date(comment.date_time))}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>{comment.comment}</Typography>
                            </Box>
                        ))}

                        {currentUser && (
                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    placeholder="Write a comment..."
                                    value={commentInputs[photo._id] || ''}
                                    onChange={(e) => setCommentInputs({ ...commentInputs, [photo._id]: e.target.value })}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault() 
                                            handleCommentSubmit(photo._id)
                                        }
                                    }}
                                />
                                <Button variant="contained" endIcon={<SendIcon />} onClick={() => handleCommentSubmit(photo._id)}>
                                    Post
                                </Button>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            ))}
        </Box>
    )
}

export default UserPhotos