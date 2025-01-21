import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent, CardActions, Typography, Chip, Grid } from '@mui/material';
import { Work, Description, LocationOn, AttachMoney, Schedule, Category } from '@mui/icons-material';

const JobPostings = () => {
  const [jobPosts, setJobPosts] = useState([]);

  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/publisher/jobs', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setJobPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch job posts:', error);
      }
    };

    fetchJobPosts();
  }, []);

  return (
    <div className="p-8">
      <Grid container spacing={0} justifyContent="space-evenly">
        <Grid item xs={12}>
          <div className="flex pl-36 justify-between items-center mb-4">
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
        {jobPosts.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job.id}>
            <Card className="w-fit">
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  {job.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p" className="mb-2">
                  <Category className="mr-1"/> {job.category}
                </Typography>
                <div className="h-px bg-gray-300 my-4"/>
                <Typography variant="body2" color="textSecondary" component="p" className="mb-2">
                  {job.description}
                </Typography>
                <div className="h-px bg-gray-300 my-4"/>
                <div className="flex gap-2 w-max mb-2 p-2 text-sm bg-gray-100 rounded-md">
                  <Typography variant="body2" color="textSecondary" component="p" className="mb-2">
                    <LocationOn className="mr-1 text-sm"/> {job.location}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p" className="mb-2">
                    <AttachMoney className="mr-1 text-sm"/> {job.salary_range}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p" className="mb-2">
                    <Schedule className="mr-1 text-sm"/> Posted on {new Date(job.created_at).toLocaleDateString()}
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
              <Button size="small" color="primary">
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default JobPostings;
