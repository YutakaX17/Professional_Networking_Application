import React, { useState } from 'react';
import { Typography, Button, Chip } from '@mui/material';
import { Edit } from '@mui/icons-material';
import JobEdit from './JobEdit';

const JobDetails = ({ job }) => {
  const [openEdit, setOpenEdit] = useState(false);

  const handleEditClick = () => {
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  return (
    <div>
      <Typography variant="h4" component="h2" gutterBottom>
        {job.title}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {job.company_name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {job.description}
      </Typography>
      <div className="mb-4">
        <Chip label={job.category} size="small" className="mr-2" color="primary" />
        <Chip label={job.job_type} size="small" className="mr-2" color="secondary" />
        <Chip
          label={job.status}
          size="small"
          className={`${
            job.status === 'Active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        />
      </div>
      <Typography variant="subtitle2" gutterBottom>
        Location: {job.location}
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        Salary Range: {job.salary_range}
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        Date Created: {new Date(job.created_at).toLocaleDateString()}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Responsibilities:
      </Typography>
      <ul>
        {job.responsibilities.map((responsibility, index) => (
          <li key={index}>{responsibility}</li>
        ))}
      </ul>
      <Typography variant="h6" gutterBottom>
        Requirements:
      </Typography>
      <ul>
        {job.requirements.map((requirement, index) => (
          <li key={index}>{requirement}</li>
        ))}
      </ul>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Edit />}
        onClick={handleEditClick}
        className="mt-4"
      >
        Edit Job
      </Button>
      <JobEdit
        open={openEdit}
        onClose={handleEditClose}
        job={job}
      />
    </div>
  );
};

export default JobDetails;