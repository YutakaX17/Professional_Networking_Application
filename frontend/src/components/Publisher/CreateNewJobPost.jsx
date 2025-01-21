import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, IconButton, Chip, Select, MenuItem } from '@mui/material';
import { Add, Close } from '@mui/icons-material';

const CreateNewJobPost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [responsibilities, setResponsibilities] = useState([]);
  const [newResponsibility, setNewResponsibility] = useState('');
  const [requirements, setRequirements] = useState([]);
  const [newRequirement, setNewRequirement] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [jobTypes, setJobTypes] = useState([]);
  const [selectedJobType, setSelectedJobType] = useState('');
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch job categories, job types, and statuses from the backend API
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get('http://localhost:5000/publisher/job-categories');
        setCategories(categoriesResponse.data);

        const jobTypesResponse = await axios.get('http://localhost:5000/publisher/job-types');
        setJobTypes(jobTypesResponse.data);

        const statusesResponse = await axios.get('http://localhost:5000/publisher/job-statuses');
        setStatuses(statusesResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddResponsibility = () => {
    if (newResponsibility.trim() !== '') {
      setResponsibilities([...responsibilities, newResponsibility.trim()]);
      setNewResponsibility('');
    }
  };

  const handleRemoveResponsibility = (index) => {
    const updatedResponsibilities = [...responsibilities];
    updatedResponsibilities.splice(index, 1);
    setResponsibilities(updatedResponsibilities);
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim() !== '') {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const handleRemoveRequirement = (index) => {
    const updatedRequirements = [...requirements];
    updatedRequirements.splice(index, 1);
    setRequirements(updatedRequirements);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/publisher/jobs', {
        title,
        description,
        location,
        responsibilities,
        requirements,
        salary_range: salaryRange,
        category_id: selectedCategory,
        job_type_id: selectedJobType,
        status_id: selectedStatus,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate('/publisher/jobs');
    } catch (error) {
      console.error('Failed to create job post:', error);
    }
  };

  return (
    <div className="p-10 px-36 shadow bg-gray-50">
      <div className="max-w-md mx-auto shadow-lg p-6 bg-white rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Create New Job Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center">
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />
          </div>
          <div className="flex items-start">
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={4}
              required
            />
          </div>
          <div className="flex items-center">
            <TextField
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
            />
          </div>
          <div className="flex items-center">
            <TextField
              label="Salary Range"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              fullWidth
            />
          </div>
          <div className="flex items-center">
            <Select
              label="Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              fullWidth
              required
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="flex items-center">
            <Select
              label="Job Type"
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
              fullWidth
              required
            >
              {jobTypes.map((jobType) => (
                <MenuItem key={jobType.id} value={jobType.id}>
                  {jobType.name}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="flex items-center">
            <Select
              label="Status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              fullWidth
              required
            >
              {statuses.map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  {status.name}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="flex items-center">
            <TextField
              label="Add Responsibility"
              value={newResponsibility}
              onChange={(e) => setNewResponsibility(e.target.value)}
              fullWidth
            />
            <IconButton onClick={handleAddResponsibility}>
              <Add />
            </IconButton>
          </div>
          <div className="flex flex-wrap gap-2">
            {responsibilities.map((responsibility, index) => (
              <Chip
                key={index}
                label={responsibility}
                onDelete={() => handleRemoveResponsibility(index)}
                deleteIcon={<Close />}
              />
            ))}
          </div>
          <div className="flex items-center">
            <TextField
              label="Add Requirement"
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              fullWidth
            />
            <IconButton onClick={handleAddRequirement}>
              <Add />
            </IconButton>
          </div>
          <div className="flex flex-wrap gap-2">
            {requirements.map((requirement, index) => (
              <Chip
                key={index}
                label={requirement}
                onDelete={() => handleRemoveRequirement(index)}
                deleteIcon={<Close />}
              />
            ))}
          </div>
          <Button type="submit" variant="contained" color="primary">
            Create Job Post
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateNewJobPost;

