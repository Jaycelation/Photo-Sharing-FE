import React, { useState, useEffect } from "react"
import {
    Divider, List, ListItem, ListItemText, ListItemAvatar, Typography, Avatar, Box, IconButton
} from "@mui/material"
import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined"
import PersonIcon from '@mui/icons-material/Person'
import { Link } from "react-router-dom"
import fetchModel from "../../lib/fetchModelData"

function UserList() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchModel("/user/list")
                if (data) {
                    setUsers(data)
                }
            } catch (error) {
                console.error("Error fetching user list:", error)
            }
        }
        fetchData()
    }, [])

    return (
        <div className="user-list">
            <Typography variant="h5" sx={{ mb: 2, mt: 2, px: 2, fontWeight: 'bold' }}>
                User List
            </Typography>
            <List component="nav" sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {users.map((item) => (
                    <React.Fragment key={item._id}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: "primary.main" }}>
                                    {(item.first_name && item.last_name)
                                        ? `${item.first_name[0]}${item.last_name[0]}`
                                        : <PersonIcon />}
                                </Avatar>
                            </ListItemAvatar>

                            <ListItemText
                                primary={
                                    <Link
                                        to={`/users/${item._id}`}
                                        style={{ textDecoration: "none", color: "#333", fontWeight: "bold" }}
                                    >
                                        {item.first_name} {item.last_name}
                                    </Link>
                                }
                                secondary={
                                    <Typography variant="body2" color="text.secondary">
                                        Click name to see details
                                    </Typography>
                                }
                            />

                            <Box>
                                <IconButton
                                    component={Link}
                                    to={`/photos/${item._id}`}
                                    color="primary"
                                    title="View Photos"
                                >
                                    <PhotoOutlinedIcon />
                                </IconButton>
                            </Box>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))}
            </List>
        </div>
    )
}

export default UserList