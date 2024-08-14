import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import 'tailwindcss/tailwind.css';

function Validator() {
  const [files, setFiles] = useState([]);
  const [validationResults, setValidationResults] = useState(null); // State for validation results
  const [error, setError] = useState(null);
  const [showNoDataMessage, setShowNoDataMessage] = useState(true); // State to show "No files selected yet" message

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length !== 4) {
        setError('Please upload exactly 4 files.');
        return;
      }
      setFiles(acceptedFiles);
      setError(null);
      setShowNoDataMessage(false); // hide message and svg icon
    },
    accept: '.csv',
  });

  const handleValidate = async () => {
    if (files.length !== 4) {
      setError('Please upload exactly 4 files.');
      return;
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post('http://localhost:3002/api/nic-validation/validate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setValidationResults(response.data.data);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError('Failed to validate NICs'); // Set error message if validation fails
    }
  };

  useEffect(() => {
    if (validationResults) {
      setShowNoDataMessage(false); // Hide message when results are available
    }
  }, [validationResults]);

  return (
    <div className="container mx-auto p-6 pt-28 px-8 flex-grow">

<div className="flex flex-col items-center gap-4 mb-6">
  <div
    {...getRootProps()}
    className={`w-full md:w-2/3 lg:w-1/2 border-2 border-dashed p-6 rounded-lg shadow-lg transition duration-300 ease-in-out ${
      isDragActive ? 'bg-gray-100 border-blue-500' : 'bg-white border-gray-300'
    }`}
  >
    <input {...getInputProps()} />
    <p className="text-lg font-semibold text-center">
      {isDragActive ? 'Drop the files here...' : 'Drag & Drop'}
    </p>
  </div>

  <button 
    type="button" 
    onClick={handleValidate}
    className="w-full md:w-2/3 lg:w-1/2 px-6 py-3 h-16 mt-4 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  >
    Validate
  </button>
</div>


      <div className="mb-6">
        {files.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Selected Files:</h3>
            <ul className="list-disc pl-5">
              {Array.from(files).map((file, index) => (
                <li key={index} className="mb-2">
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {showNoDataMessage && !validationResults && (
        <div className="flex flex-col items-center justify-center min-h-[356px] opacity-50">
          <p className="text-lg text-gray-500">No files selected yet</p>
        </div>
      )}

      {error && <p className="text-red-500 text-center">{error}</p>}

      {validationResults && (
        <div className="bg-white p-4 rounded-lg shadow-lg mt-6">
          <h3 className="text-xl font-bold mb-4">Validation Results:</h3>
          <ul className="list-disc pl-5">
            {validationResults.map((result, index) => (
              <li key={index} className="mb-2">
                <span className="font-semibold">NIC:</span> {result.nic_number}, 
                <span className="font-semibold"> Birthday:</span> {result.birthday}, 
                <span className="font-semibold"> Age:</span> {result.age}, 
                <span className="font-semibold"> Gender:</span> {result.gender}, 
                <span className="font-semibold"> File:</span> {result.file_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Validator;
