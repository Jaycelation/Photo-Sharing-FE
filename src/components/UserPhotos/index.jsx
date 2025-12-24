import React, { useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
    Card, CardContent, CardHeader, Divider, Avatar, Box, Alert, CircularProgress,
    TextField, Button, CardActions, Typography, Chip, IconButton
} from '@mui/material'
import { red } from '@mui/material/colors'
import SendIcon from '@mui/icons-material/Send'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

import fetchModel from '../../lib/fetchModelData'
import { BE_URL } from '../../lib/config'
import UserComment from '../UserComment'
import './styles.css'

function UserPhotos({ setContext, currentUser, onRefresh }) { 
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
            console.error("Error loading data:", err)
            setError("Could not load photos.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [userId])

    const handleLike = async (photoId) => {
        if (!currentUser) return

        try {
            const response = await fetch(`${BE_URL}/photos/like/${photoId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ user_id: currentUser._id }) 
            })

            if (response.ok) {
                await loadData()
            } else {
                console.error("Like failed with status:", response.status)
            }
        } catch (err) {
            console.error("Like API Error:", err)
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
            await loadData() 
            if (onRefresh) onRefresh()
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) return <Box className="loading-box"><CircularProgress /></Box>
    if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
    if (!photos || photos.length === 0) return <Alert severity="info" sx={{ m: 2 }}>This user has not posted any photos yet.</Alert>

    return (
        <Box className="photo-list-container">
            {photos.map((photo) => {
                let myCommentCount = 0
                if (currentUser && photo.comments) {
                    myCommentCount = photo.comments.filter(comment => {
                        return comment.user && String(comment.user._id) === String(currentUser._id)
                    }).length
                }
                const likeList = Array.isArray(photo.likes) ? photo.likes : []
                
                const isLiked = currentUser && likeList.some(userLike => {
                    const idInDB = (typeof userLike === 'object' && userLike !== null) ? userLike._id : userLike
                    return String(idInDB) === String(currentUser._id)
                })

                return (
                    <Card key={photo._id} variant="outlined" className="photo-card">
                        <CardHeader
                            avatar={<Avatar sx={{ bgcolor: red[500] }}>P</Avatar>}
                            title={dateTimeFormatter.format(new Date(photo.date_time))}
                            subheader={photo.file_name}
                            action={
                                myCommentCount > 0 && (
                                    <Chip label={`My Cmts: ${myCommentCount}`} color="primary" variant="outlined" size="small" />
                                )
                            }
                        />

                        <CardContent>
                            <Box
                                component="img"
                                src={`${BE_URL}/images/${photo.file_name}`}
                                alt={photo.file_name}
                                className="photo-image"
                            />
                        </CardContent>

                        <CardActions disableSpacing>
                            <Box display="flex" alignItems="center" gap={0.5}>
                                <IconButton onClick={() => handleLike(photo._id)} disabled={!currentUser}>
                                    {isLiked ? (
                                        <FavoriteIcon sx={{ color: 'red' }} />
                                    ) : (
                                        <FavoriteBorderIcon />
                                    )}
                                </IconButton>
                                <Typography variant="body2" fontWeight="bold">
                                    {likeList.length} likes
                                </Typography>
                            </Box>
                        </CardActions>

                        <CardContent>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold'}}>
                                Comments ({photo.comments?.length || 0})
                            </Typography>
                            {photo.comments?.length > 0 ? (
                                photo.comments.map((comment) => (
                                    <UserComment 
                                    key={comment._id} comment={comment} currentUser={currentUser} photoId={photo._id} 
                                    onRefresh={() => {
                                        loadData()
                                        if (onRefresh) onRefresh()
                                    }} />
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
                                    No comments yet.
                                </Typography>
                            )}
                            {currentUser && (
                                <Box className="comment-input-area" sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                    <TextField
                                        size="small" fullWidth placeholder="Write a comment..."
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
                )
            })}
        </Box>
    )
}

export default UserPhotos