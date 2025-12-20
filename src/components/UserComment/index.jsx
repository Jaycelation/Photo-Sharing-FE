import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Typography } from '@mui/material'

function UserComment({ comment }) {
    const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium', timeStyle: 'short',
    })

    return (
        <Box sx={{ mb: 2, bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
            <Typography variant="subtitle2" component="span" fontWeight="bold">
                {comment.user ? (
                    <Link to={`/users/${comment.user._id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                        {comment.user.first_name} {comment.user.last_name}
                    </Link>
                ) : (
                    <span>Unknown User</span>
                )}
            </Typography>

            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                {dateTimeFormatter.format(new Date(comment.date_time))}
            </Typography>

            <Typography variant="body2" sx={{ mt: 0.5 }}>
                {comment.comment}
            </Typography>
        </Box>
    )
}

export default UserComment