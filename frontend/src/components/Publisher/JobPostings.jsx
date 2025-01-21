import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent, CardActions, Typography, Chip, Grid } from '@mui/material';
import { Work, LocationOn, AttachMoney, Schedule, Category } from '@mui/icons-material';
import JobDetails from './JobDetails';

const JobPostings = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/publisher/jobs', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setJobPosts(response.data);
        setSelectedJob(response.data[0]);
      } catch (error) {
        console.error('Failed to fetch job posts:', error);
      }
    };

    fetchJobPosts();
  }, []);

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h4" component="h2">
            Job Postings
          </Typography>
          <Link to="/publisher/jobs/create">
            <Button variant="contained" color="primary" startIcon={<Work />}>
              Create Job Post
            </Button>
          </Link>
        </div>
      </Grid>
      <Grid item xs={12} sm={6}>
        {jobPosts.map((job) => (
          <Card key={job.id} className="mb-4">
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                {job.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p" className="mb-2">
                <Category className="mr-1" /> {job.category}
              </Typography>
              <div className="flex gap-2 w-max mb-2 p-2 text-sm bg-gray-100 rounded-md">
                <Typography variant="body2" color="textSecondary" component="p" className="mb-2">
                  <LocationOn className="mr-1 text-sm" /> {job.location}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p" className="mb-2">
                  <AttachMoney className="mr-1 text-sm" /> {job.salary_range}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p" className="mb-2">
                  <Schedule className="mr-1 text-sm" /> Posted on {new Date(job.created_at).toLocaleDateString()}
                </Typography>
              </div>
              <div>
                <Chip
                  label={job.job_type}
                  size="small"
                  className="mr-2"
                  color="primary"
                />
                <Chip
                  label={job.status}
                  size="small"
                  className={`${
                    job.status === 'Active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}
                />
              </div>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color={selectedJob && selectedJob.id === job.id ? 'success' : 'primary'}
                onClick={() => handleJobClick(job)}
              >
                View Details
              </Button>
            </CardActions>
          </Card>
        ))}
      </Grid>
      <Grid item xs={12} sm={6}>
        {selectedJob && <JobDetails job={selectedJob} />}
      </Grid>
    </Grid>
  );
};

export default JobPostings;
