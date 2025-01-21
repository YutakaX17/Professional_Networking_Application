import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ApplicationReview = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/publisher/applications', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/publisher/applications/${applicationId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      fetchApplications();
    } catch (error) {
      console.error('Failed to update application status:', error);
    }
  };

  const downloadDocument = async (path, type) => {
    try {
      const response = await axios.get(`http://localhost:5000/publisher/download/${path}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(`Failed to download ${type}:`, error);
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Application Review
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Job Title</TableCell>
            <TableCell>Applicant</TableCell>
            <TableCell>Applied Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Documents</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id}>
              <TableCell>{app.job.title}</TableCell>
              <TableCell>
                <Button
                  onClick={() => navigate(`/seeker/profile/${app.seeker_id}`)}
                  color="primary"
                >
                  View Profile
                </Button>
              </TableCell>
              <TableCell>{new Date(app.applied_at).toLocaleDateString()}</TableCell>
              <TableCell>{app.status}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    onClick={() => downloadDocument(app.cover_letter_path, 'cover-letter')}
                    variant="outlined"
                    size="small"
                  >
                    Cover Letter
                  </Button>
                  <Button
                    onClick={() => downloadDocument(app.resume_path, 'resume')}
                    variant="outlined"
                    size="small"
                  >
                    Resume
                  </Button>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    onClick={() => handleStatusUpdate(app.id, 'Approved')}
                    variant="contained"
                    color="success"
                    size="small"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(app.id, 'Rejected')}
                    variant="contained"
                    color="error"
                    size="small"
                  >
                    Reject
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default ApplicationReview;
