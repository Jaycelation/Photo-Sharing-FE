import React, { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Divider,
  Avatar,
  Box,
  Alert,
  CircularProgress
} from '@mui/material'
import { red } from '@mui/material/colors'

import fetchModel from '../../lib/fetchModelData'

function UserPhotos({ setContext }) {
  const { userId } = useParams()
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const dateTimeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    []
  )

  useEffect(() => {
    setPhotos([])
    setLoading(true)
    setError(null)

    const fetchData = async () => {
      try {
        const [userData, photosData] = await Promise.all([
          fetchModel(`/user/${userId}`),
          fetchModel(`/photo/photosOfUser/${userId}`)
        ])
        if (userData && userData.first_name) {
          setContext(`Photos of ${userData.first_name} ${userData.last_name}`)
        }
        if (Array.isArray(photosData)) {
          setPhotos(photosData)
        } else {
            console.error("Invalid photos data:", photosData)
            setError("Could not load photos.")
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("An error occurred while loading data.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId, setContext])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
     return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
  }

  if (!photos || photos.length === 0) {
    return (
      <Alert severity="info" sx={{ margin: 2 }}>
        This user has not posted any photos yet.
      </Alert>
    )
  }

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
      {photos.map((photo) => (
        <Card key={photo._id} variant="outlined" sx={{ marginBottom: 4 }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                P
              </Avatar>
            }
            title={dateTimeFormatter.format(new Date(photo.date_time))}
            subheader={photo.file_name}
          />

          <CardContent>
            <Box
              component="img"
              src={`/images/${photo.file_name}`}
              alt={photo.file_name}
              sx={{
                width: '100%',
                height: 'auto',
                display: 'block',
                marginBottom: 2,
                borderRadius: 1,
                objectFit: 'contain',
                maxHeight: '500px'
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400?text=Image+Not+Found'
              }}
            />

            <Divider sx={{ my: 2 }}>Comments</Divider>

            {photo.comments && photo.comments.length > 0 ? (
              photo.comments.map((comment) => (
                <Box
                  key={comment._id}
                  sx={{ mb: 2, bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}
                >
                  <Typography
                    variant="subtitle2"
                    component="span"
                    sx={{ fontWeight: 'bold' }}
                  >
                    {comment.user ? (
                      <Link
                        to={`/users/${comment.user._id}`}
                        style={{ textDecoration: 'none', color: '#1976d2' }}
                      >
                        {comment.user.first_name} {comment.user.last_name}
                      </Link>
                    ) : (
                      <span style={{ color: 'gray', fontStyle: 'italic' }}>
                        Unknown User
                      </span>
                    )}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ marginLeft: 1 }}
                  >
                    {dateTimeFormatter.format(new Date(comment.date_time))}
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {comment.comment}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                No comments yet.
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

export default UserPhotos