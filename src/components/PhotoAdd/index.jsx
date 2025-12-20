import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Typography, Box, Alert, Input } from '@mui/material'
import { BE_URL } from '../../lib/config'

function AddPhoto() {
    const [file, setFile] = useState(null)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0])
        }
    }

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!file) {
            setError("Please select a file first.")
            return
        }

        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fetch(`${BE_URL}/photos/new`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            })

            if (!response.ok) {
                throw new Error("Upload failed")
            }
            navigate('/')
        } catch (err) {
            console.error(err)
            setError("Error uploading photo.")
        }
    }

    return (
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom>Upload New Photo</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '400px' }}>
                <Input
                    type="file"
                    onChange={handleFileChange}
                    inputProps={{ accept: 'image/*' }}
                />

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button 
                        variant="outlined" 
                        color="primary" 
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>

                    <Button variant="contained" type="submit" disabled={!file}>
                        Upload Photo
                    </Button>
                </Box>

                {file && (
                    <Box mt={2} textAlign="center">
                        <Typography variant="subtitle1">Preview:</Typography>
                        <img
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            style={{ maxWidth: '100%', maxHeight: '300px', marginTop: '10px', objectFit: 'contain' }}
                        />
                    </Box>
                )}
            </form>
        </Box>
    )
}

export default AddPhoto