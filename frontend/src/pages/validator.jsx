import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import 'tailwindcss/tailwind.css';

function Validator() {
  const [files, setFiles] = useState([]);
  const [validationResults, setValidationResults] = useState(null);
  const [error, setError] = useState(null);
  const [showNoDataMessage, setShowNoDataMessage] = useState(true);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length !== 4) {
        setError('Please upload exactly 4 files.');
        return;
      }
      setFiles(acceptedFiles);
      setError(null);
      setShowNoDataMessage(false);
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
      setError(null);
    } catch (err) {
      setError('Failed to validate NICs');
    }
  };

  useEffect(() => {
    if (validationResults) {
      setShowNoDataMessage(false);
    }
  }, [validationResults]);

  return (
    <div className="container mx-auto p-6 pt-28 px-8 flex-grow bg-gradient-to-r from-blue-50 to-green-50 min-h-screen">
      <div className="flex flex-col items-center gap-6 mb-8">
        <div
          {...getRootProps()}
          className={`w-full md:w-2/3 lg:w-1/2 border-4 border-dashed p-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform ${
            isDragActive ? 'bg-blue-100 border-blue-600 scale-105' : 'bg-white border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-lg font-medium text-center">
            {isDragActive ? 'Drop the files here...' : 'Drag & Drop your CSV files here'}
          </p>
        </div>

        <button 
          type="button" 
          onClick={handleValidate}
          className="w-full md:w-2/3 lg:w-1/2 px-6 py-3 h-16 mt-4 text-base font-semibold text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300"
        >
          Validate
        </button>
      </div>

      <div className="mb-6">
        {files.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">Selected Files:</h3>
            <ul className="list-disc pl-5">
              {Array.from(files).map((file, index) => (
                <li key={index} className="mb-2 text-gray-700">
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

      {error && <p className="text-red-500 text-center font-medium">{error}</p>}

      {validationResults && (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6 overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4 text-green-600">Validation Results:</h3>
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b-2 border-gray-200 p-2">NIC</th>
                <th className="border-b-2 border-gray-200 p-2">Birthday</th>
                <th className="border-b-2 border-gray-200 p-2">Age</th>
                <th className="border-b-2 border-gray-200 p-2">Gender</th>
                <th className="border-b-2 border-gray-200 p-2">File</th>
              </tr>
            </thead>
            <tbody>
              {validationResults.map((result, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border-b border-gray-200 p-2">{result.nic_number}</td>
                  <td className="border-b border-gray-200 p-2">{result.birthday}</td>
                  <td className="border-b border-gray-200 p-2">{result.age}</td>
                  <td className="border-b border-gray-200 p-2">{result.gender}</td>
                  <td className="border-b border-gray-200 p-2">{result.file_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Validator;

