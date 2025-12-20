import React, { useState, useEffect } from "react"
import {
    Divider, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Box
} from "@mui/material"
import { Link } from "react-router-dom"
import PersonIcon from '@mui/icons-material/Person'
import CommentIcon from '@mui/icons-material/Comment'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'

import fetchModel from "../../lib/fetchModelData"
import "./styles.css"

function UserList() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchModel("/user/list")
                if (data) setUsers(data)
            } catch (error) {
                console.error("Error fetching user list:", error)
            }
        }
        fetchData()
    }, [])

    return (
        <div>
            <Typography variant="h6" className="user-list-title">
                User List
            </Typography>

            <List component="nav">
                {users.map((item) => (
                    <React.Fragment key={item._id}>
                        <ListItem button component={Link} to={`/users/${item._id}`} alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar className="user-avatar">
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>

                            <ListItemText
                                primary={
                                    <Typography variant="body1" className="user-name">
                                        {item.first_name} {item.last_name}
                                    </Typography>
                                }

                                secondaryTypographyProps={{ component: 'div' }}

                                secondary={
                                    <div className="bubble-container">
                                        <div className="count-bubble bubble-green" title="Photos">
                                            <PhotoLibraryIcon sx={{ fontSize: 14, marginRight: 0.5 }} />
                                            {item.photo_count || 0}
                                        </div>

                                        <div className="count-bubble bubble-red" title="Comments">
                                            <CommentIcon sx={{ fontSize: 14, marginRight: 0.5 }} />
                                            {item.comment_count || 0}
                                        </div>
                                    </div>
                                }
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))}
            </List>
        </div>
    )
}

export default UserList