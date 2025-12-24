import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Typography, IconButton, TextField } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'

import { BE_URL } from '../../lib/config'
import './styles.css'

function UserComment({ comment, currentUser, photoId, onRefresh }) {
    const [isEditing, setIsEditing] = useState(false)
    const [editText, setEditText] = useState(comment.comment)

    const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium', timeStyle: 'short',
    })

    const author = comment.user || comment.user_id

    const isOwner = currentUser && author && (
        String(currentUser._id) === String(author._id)
    )

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return
        
        try {
            const response = await fetch(`${BE_URL}/comment/delete/${photoId}/${comment._id}`, {
                method: 'DELETE',
                credentials: 'include',
            })

            if (!response.ok) {
                const err = await response.text()
                throw new Error(err)
            }

            if (onRefresh) {
                onRefresh() 
            }
        } catch (error) {
            console.error("Delete failed", error)
            alert("Delete failed: " + error.message)
        }
    }

    const handleEditSubmit = async () => {
        if (!editText.trim()) return 

        try {
            const response = await fetch(`${BE_URL}/comment/edit/${photoId}/${comment._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ new_text: editText }),
                credentials: 'include',
            })

            if (!response.ok) {
                const err = await response.text()
                throw new Error(err)
            }
            setIsEditing(false)
            if (onRefresh) onRefresh() 

        } catch (error) {
            console.error("Edit failed", error)
            alert("Edit failed: " + error.message)
        }
    }

    return (
        <Box className="comment-box" sx={{ mb: 1.5, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography variant="subtitle2" component="span" fontWeight="bold">
                        {author ? (
                            <Link to={`/users/${author._id}`} className="comment-user-link" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                {author.first_name} {author.last_name}
                            </Link>
                        ) : (
                            <span style={{color: 'gray'}}>Unknown User</span>
                        )}
                    </Typography>
                    {" "}
                    <Typography variant="caption" color="text.secondary" className="comment-timestamp">
                        {dateTimeFormatter.format(new Date(comment.date_time))}
                    </Typography>
                </Box>
                
                {isOwner && !isEditing && (
                    <Box>
                        <IconButton size="small" onClick={() => setIsEditing(true)} title="Edit">
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={handleDelete} title="Delete">
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )}
            </Box>

            {isEditing ? (
                <Box mt={1} display="flex" gap={1} alignItems="center">
                    <TextField 
                        fullWidth 
                        size="small" 
                        value={editText} 
                        onChange={(e) => setEditText(e.target.value)} 
                        autoFocus
                        onKeyDown={(e) => {
                             if (e.key === 'Enter') handleEditSubmit()
                             if (e.key === 'Escape') {
                                setIsEditing(false)
                                setEditText(comment.comment)
                             }
                        }}
                    />
                    <IconButton color="primary" onClick={handleEditSubmit} title="Save">
                        <SaveIcon />
                    </IconButton>
                    <IconButton color="default" onClick={() => {
                        setIsEditing(false)
                        setEditText(comment.comment)
                    }} title="Cancel">
                        <CancelIcon />
                    </IconButton>
                </Box>
            ) : (
                <Typography variant="body2" className="comment-text" sx={{ mt: 0.5, wordWrap: 'break-word' }}>
                    {comment.comment}
                </Typography>
            )}
        </Box>
    )
}

export default UserComment