import React from "react";
import { AiOutlineEnvironment, AiOutlineClockCircle, AiOutlineCheckCircle } from "react-icons/ai";

const JobCard = ({ job, onSelect, isSelected }) => {
  return (
    <div
        className={`max-w-fit mx-auto border border-gray-300 rounded-lg shadow-md p-6 cursor-pointer transition-colors duration-200 ease-in-out ${
        isSelected ? "bg-teal-400" : "bg-white"
      } ${
        isSelected ? "bg-teal-400" : "hover:bg-gray-100"
      }`}
      onClick={() => onSelect(job)}
    >
      <div className="flex items-center">
        {/* Placeholder Logo */}
        {job.publisher_logo ? (
          <img
            src={`http://localhost:5000/${job.publisher_logo}`}
            alt={`${job.company} logo`}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {job.company?.charAt(0)?.toUpperCase()}
            </span>
          </div>
        )}
        <div className="ml-4 flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-gray-800 truncate">{job.title}</h2>
          <div className="flex items-center space-x-2">
            <p className="text-gray-500 truncate">{job.company}</p>
            <span className="text-gray-400 mx-2">•</span>
            <p className={`text-sm ${isSelected ? 'text-gray-500' : 'text-gray-400'} truncate`}>{job.created_at}</p>
          </div>
        </div>
      </div>
      <p className="mt-4 text-gray-600 line-clamp-3">{job.description}</p>
      <hr className="my-4 border-gray-300" />
      <div className="flex text-sm text-gray-500">
        {/* Location */}
        <div className="flex items-center mr-6 truncate">
          <AiOutlineEnvironment className={`${isSelected ? 'text-gray-500' : 'text-gray-400'} mr-2 flex-shrink-0`} />
          {job.location}
        </div>
        {/* Job Status */}
        <div className="flex items-center mr-6 truncate">
          <AiOutlineCheckCircle className={`${isSelected ? 'text-gray-500' : 'text-gray-400'} mr-2 flex-shrink-0`} />
          {job.status}
        </div>
        {/* Job Type */}
        <div className="flex items-center truncate">
          <AiOutlineClockCircle className={`${isSelected ? 'text-gray-500' : 'text-gray-400'} mr-2 flex-shrink-0`} />
          {job.job_type}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
