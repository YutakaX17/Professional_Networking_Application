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
import axios from 'axios';
{/*import { useNavigate } from 'react-router-dom';*/}


const ApplicationReview = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [open, setOpen] = useState(false);
  {/*const navigate = useNavigate();*/}

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleViewProfile = (event, seeker_id) => {
    event.stopPropagation();

    const fetchApplicantDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/seeker/profile/${seeker_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        setSelectedApplication(response.data);
        setOpen(true);
      } catch (error) {
        console.error('Failed to fetch applicant details:', error);
      }
    };

    fetchApplicantDetails();
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedApplication(null);
  };

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
                  onClick={(e) => handleViewProfile(e, app.seeker_id)}
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Applicant Profile</DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <div>
              <Typography variant="h6">Name: {selectedApplication.full_name}</Typography>
              <Typography variant="body1">Location: {selectedApplication.location}</Typography>
              <Typography variant="body1">Skills: {selectedApplication.skills?.join(', ')}</Typography>
              <Typography variant="body1">
                Experience: {selectedApplication.experience?.years} years
              </Typography>
              <Typography variant="body1">
                Education: {selectedApplication.education?.degree}
              </Typography>
              <Typography variant="body1">Bio: {selectedApplication.bio}</Typography>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default ApplicationReview;