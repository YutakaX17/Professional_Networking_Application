import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Alert,
} from '@mui/material';

const JobApplicationForm = ({ jobId, onClose, onSubmit }) => {
  const [coverLetter, setCoverLetter] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coverLetterError, setCoverLetterError] = useState('');
  const [resumeError, setResumeError] = useState('');

  const validateFiles = () => {
    let isValid = true;

    if (!coverLetter) {
      setCoverLetterError('Cover letter is required');
      isValid = false;
    } else if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      .includes(coverLetter.type)) {
      setCoverLetterError('Please upload a PDF or Word document');
      isValid = false;
    }

    if (!resume) {
      setResumeError('Resume is required');
      isValid = false;
    } else if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      .includes(resume.type)) {
      setResumeError('Please upload a PDF or Word document');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  if (!validateFiles()) {
    return;
  }

  setLoading(true);

  try {
    const formData = new FormData();
    formData.append('coverLetter', coverLetter);
    formData.append('resume', resume);

    const token = localStorage.getItem('token');
    const response = await axios.post(
      `http://localhost:5000/seeker/jobs/${jobId}/apply`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    setLoading(false);
    if (onSubmit) {
      onSubmit(jobId);
    }
    onClose();
  } catch (err) {
    setLoading(false);
    setError(err.response?.data?.error || 'Failed to submit application. Please try again.');
  }
};

  const handleFileChange = (setter, errorSetter) => (event) => {
    const file = event.target.files[0];
    setter(file);
    errorSetter('');
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Apply for Position</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Cover Letter
            </Typography>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange(setCoverLetter, setCoverLetterError)}
              style={{ display: 'none' }}
              id="cover-letter-upload"
            />
            <label htmlFor="cover-letter-upload">
              <Button
                variant="outlined"
                component="span"
                fullWidth
              >
                {coverLetter ? coverLetter.name : 'Upload Cover Letter'}
              </Button>
            </label>
            {coverLetterError && (
              <Typography color="error" variant="caption">
                {coverLetterError}
              </Typography>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Resume
            </Typography>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange(setResume, setResumeError)}
              style={{ display: 'none' }}
              id="resume-upload"
            />
            <label htmlFor="resume-upload">
              <Button
                variant="outlined"
                component="span"
                fullWidth
              >
                {resume ? resume.name : 'Upload Resume'}
              </Button>
            </label>
            {resumeError && (
              <Typography color="error" variant="caption">
                {resumeError}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default JobApplicationForm;