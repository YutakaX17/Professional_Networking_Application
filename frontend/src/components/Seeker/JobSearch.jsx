import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Select, MenuItem, Grid, FormControl, InputLabel } from '@mui/material';
import JobCard from "./JobCard";
import JobApplicationForm from "./JobApplicationForm";

const JobSearch = () => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [jobCategories, setJobCategories] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
  const initializeData = async () => {
    await fetchJobCategories();
    await fetchJobTypes();
    const jobsData = await fetchJobs();
    if (jobsData && jobsData.length > 0) {
      setSelectedJob(jobsData[0]);
    }
  };

   initializeData();
  }, []);

  const fetchJobCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/publisher/job-categories');
      setJobCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch job categories:', error);
    }
  };

  const fetchJobTypes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/publisher/job-types');
      setJobTypes(response.data);
    } catch (error) {
      console.error('Failed to fetch job types:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/seeker/jobs');
      setJobs(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

  const handleSearch = async () => {
  try {
    const response = await axios.get('http://localhost:5000/seeker/jobs', {
      params: {
        search: searchTerm,
        category: selectedCategory,
        jobType: selectedJobType,
      },
    });
    setJobs(response.data);
  } catch (error) {
    console.error('Failed to perform job search:', error);
  }
};

const handleApply = async (jobId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `http://localhost:5000/seeker/jobs/${jobId}/apply`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('Job application submitted successfully:', response.data);
    // Show success message or perform any other necessary actions
  } catch (error) {
    console.error('Failed to apply for the job:', error);
    // Show error message or perform any other necessary actions
  }
};

const handleApplicationSubmit = () => {
    console.log('handleApplicationSubmit called');
    handleApply(selectedJob.id);
  };

  const handleApplyClick = () => {
    console.log('Apply button clicked, showing application form');
    setShowApplicationForm(true);
  };


  return (
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Job Search</h2>

          <Grid container spacing={2} alignItems="center" className="mb-6">
            <Grid item xs={12} sm={4}>
              <TextField
                  label="Search jobs"
                  variant="outlined"
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    sx: {
                      height: '2.5rem',
                    },
                  }}
                  className="sm:!h-8 lg:!h-10"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Category</InputLabel>
                <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    label="Category"
                    className="sm:!h-8 lg:!h-10"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {jobCategories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Job Type</InputLabel>
                <Select
                    value={selectedJobType}
                    onChange={(e) => setSelectedJobType(e.target.value)}
                    label="Job Type"
                    className="sm:!h-8 lg:!h-10"
                >
                  <MenuItem value="">All Job Types</MenuItem>
                  {jobTypes.map((jobType) => (
                      <MenuItem key={jobType.id} value={jobType.id}>
                        {jobType.name}
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button variant="contained" color="primary" fullWidth onClick={handleSearch}>
                Search
              </Button>
            </Grid>
          </Grid>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Jobs List */}
            <div className="space-y-4">
              {jobs.map((job) => (
                  <JobCard
                      key={job.id}
                      job={job}
                      onSelect={(job) => setSelectedJob(job)}
                      isSelected={selectedJob && selectedJob.id === job.id}
                  />
              ))}
            </div>

            {/* Job Details Panel */}
            {selectedJob ? (
              <div className="bg-white rounded-lg shadow-md p-6 space-y-6 sticky top-6">
                <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                <div className="space-y-2">
                  <p className="text-lg font-semibold">{selectedJob.company}</p>
                  <p className="text-gray-600">{selectedJob.location}</p>
                  <p className="text-gray-600">{selectedJob.salary_range}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-700">{selectedJob.description}</p>
                  </div>

                  {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Responsibilities</h3>
                    <ul className="list-disc pl-5">
                      {selectedJob.responsibilities.map((resp, index) => (
                        <li key={index} className="text-gray-700">{resp}</li>
                      ))}
                    </ul>
                  </div>
                  )}

                  {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                   <div>
                     <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                     <ul className="list-disc pl-5">
                       {selectedJob.requirements.map((req, index) => (
                         <li key={index} className="text-gray-700">{req}</li>
                       ))}
                     </ul>
                   </div>
                   )}
                </div>

                <div className="flex space-x-4">
                  {showApplicationForm ? (
                    <JobApplicationForm
                      jobId={selectedJob.id}
                      onClose={() => setShowApplicationForm(false)}
                      onSubmit={handleApplicationSubmit}
                    />
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleApplyClick}
                    >
                      Apply Now
                    </Button>
                  )}
                    <Button
                      variant="outlined"
                      onClick={() => {/* Add company details navigation */}}
                    >
                      View Company Details
                    </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
  );
};

export default JobSearch;
