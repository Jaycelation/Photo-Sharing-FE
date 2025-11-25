import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import fetchModel from '../../lib/fetchModelData'

function UserDetail({ setContext }) {
  const { userId } = useParams()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchModel(`/user/${userId}`)
        setUser(data)

        if (setContext && data && data.first_name && data.last_name) {
          setContext(`${data.first_name} ${data.last_name}`)
        }
      } catch (error) {
        console.error("Error fetching user details:", error)
      }
    }
    fetchUserData()
  }, [userId])

  if (!user) {
    return (
      <Typography variant="body1" style={{ padding: '20px' }}>
        Loading user info...
      </Typography>
    )
  }

  return (
    <Card variant="outlined" sx={{ margin: 'auto', maxWidth: 600, mt: 4 }}>
      <CardContent>
        <Typography variant="h4" component="div" gutterBottom>
          {user.first_name} {user.last_name}
        </Typography>
        
        <Typography color="text.secondary" variant="h6" gutterBottom>
          {user.occupation}
        </Typography>
        
        <Typography variant="body1" sx={{ marginBottom: 2, fontStyle: 'italic' }}>
          "{user.description}"
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          <strong>Location:</strong> {user.location}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={`/photos/${user._id}`} //
        >
          View Photos
        </Button>
      </CardContent>
    </Card>
  )
}

export default UserDetail