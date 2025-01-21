import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import axios from "axios";

const JobEdit = ({ open, onClose, job }) => {
  const [description, setDescription] = useState(job.description);
  const [responsibilities, setResponsibilities] = useState(job.responsibilities.join('\n'));
  const [requirements, setRequirements] = useState(job.requirements.join('\n'));
  const [salaryRange, setSalaryRange] = useState(job.salary_range);

  const handleSave = async () => {
    try {
      const updatedJob = {
        ...job,
        description,
        responsibilities: responsibilities.split('\n'),
        requirements: requirements.split('\n'),
        salary_range: salaryRange,
      };

      // Make API call to update the job
      await axios.put(`http://localhost:5000/publisher/jobs/${job.id}`, updatedJob, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      onClose();
    } catch (error) {
      console.error('Failed to update job:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Job</DialogTitle>
        <DialogContent>
            <div className="mb-4"></div>
            <div className="mb-4">
                <TextField
                    label="Description"
                    multiline
                    rows={4}
                    fullWidth
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <TextField
                    label="Responsibilities"
                    multiline
                    rows={4}
                    fullWidth
                    value={responsibilities}
                    onChange={(e) => setResponsibilities(e.target.value)}
                    className="mb-4"
                />
            </div>
            <div className="mb-4">
                <TextField
                    label="Requirements"
                    multiline
                    rows={4}
                    fullWidth
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="mb-4"
                />
            </div>
            <div className="mb-4">
                <TextField
                    label="Salary Range"
                    fullWidth
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                />
            </div>
        </DialogContent>
        <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JobEdit;
