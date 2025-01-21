import React, { useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box
} from '@mui/material';

const JobApplicationForm = ({ jobId, onClose, onSubmit }) => {
  const [coverLetter, setCoverLetter] = useState(null);
  const [resume, setResume] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('coverLetter', coverLetter);
    formData.append('resume', resume);
    formData.append('jobId', jobId);

    await onSubmit(formData);
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Apply for Position</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <input
            accept=".pdf,.doc,.docx"
            type="file"
            onChange={(e) => setCoverLetter(e.target.files[0])}
            required
          />
          <input
            accept=".pdf,.doc,.docx"
            type="file"
            onChange={(e) => setResume(e.target.files[0])}
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          Submit Application
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JobApplicationForm;
