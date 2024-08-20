import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';
import 'tailwindcss/tailwind.css';

function Management() {
  const [nicData, setNicData] = useState([]);
  const [filters, setFilters] = useState({
    date: '',
    gender: '',
    file_name: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/nic-validation', { params: filters });
      setNicData(response.data);
    } catch (err) {
      console.error('Failed to fetch NIC data:', err);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const generateCSV = (heading) => {
    const csvData = [
      [heading],
      ['NIC', 'Birthday', 'Age', 'Gender', 'File Name'],
      ...nicData.map((nic) => [
        nic.nic_number,
        nic.birthday,
        nic.age,
        nic.gender,
        nic.file_name,
      ]),
    ];

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'NIC Report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const generatePDF = (heading) => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setTextColor(0, 102, 204); 
    doc.text(heading, 50, 18);

    doc.setDrawColor(0, 102, 204); 
    doc.line(10, 25, 200, 25); 

    doc.autoTable({
      startY: 30,
      head: [['NIC', 'Birthday', 'Age', 'Gender', 'File Name']],
      body: nicData.map((nic) => [
        nic.nic_number,
        nic.birthday,
        nic.age,
        nic.gender,
        nic.file_name,
      ]),
      theme: 'striped', 
      headStyles: {
        fillColor: [0, 102, 204], 
        textColor: [255, 255, 255], 
        fontSize: 12,
      },
      bodyStyles: {
        fontSize: 10,
      },
      margin: { top: 40 },
      styles: {
        cellPadding: 2,
        font: 'Helvetica',
      },
      columnStyles: {
        0: { cellWidth: 40 }, 
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 55 },
      },
    });

    doc.save('NIC Report.pdf');
  };

  const handleReport = async () => {
    const genderText = filters.gender ? ` - ${filters.gender}` : '';
    const heading = `NIC Data${genderText}`;

    const { value: format } = await Swal.fire({
      title: 'Select Report Format',
      input: 'radio',
      inputOptions: { csv: 'CSV', pdf: 'PDF' },
      inputValidator: (value) => {
        if (!value) return 'You need to choose a format!';
      },
      confirmButtonText: 'Generate',
    });

    if (format === 'csv') generateCSV(heading);
    else if (format === 'pdf') generatePDF(heading);

    Swal.fire({
      title: 'Report Generated!',
      text: `Your ${format.toUpperCase()} report will download automatically.`,
      icon: 'success',
      confirmButtonText: 'OK',
    });
  };

  const handlePageChange = (direction) => {
    if (direction === 'next') {
      setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(nicData.length / itemsPerPage)));
    } else {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    }
  };

  const paginatedData = nicData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="container mx-auto p-6 pt-28 px-8 bg-gradient-to-r from-indigo-50 to-blue-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-8 space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
          <div className="flex items-center">
            <label className="mr-2 text-lg font-semibold">Gender:</label>
            <select
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="mr-2 text-lg font-semibold">File Name:</label>
            <input
              type="text"
              name="file_name"
              value={filters.file_name}
              onChange={handleFilterChange}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <button 
          onClick={handleReport}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Generate Report
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="mt-4 table-auto w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-3 px-4 border-b border-gray-300 text-left">NIC</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left">Birthday</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left">Age</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left">Gender</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left">File Name</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((nic, index) => (
              <tr key={index} className="hover:bg-gray-100 transition-colors">
                <td className="py-2 px-4 border-b border-gray-300 text-left">{nic.nic_number}</td>
                <td className="py-2 px-4 border-b border-gray-300 text-left">{nic.birthday}</td>
                <td className="py-2 px-4 border-b border-gray-300 text-left">{nic.age}</td>
                <td className="py-2 px-4 border-b border-gray-300 text-left">{nic.gender}</td>
                <td className="py-2 px-4 border-b border-gray-300 text-left">{nic.file_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange('prev')}
          disabled={currentPage === 1}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-full shadow-md transition-transform transform hover:scale-105 disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-lg font-semibold">{`Page ${currentPage} of ${Math.ceil(nicData.length / itemsPerPage)}`}</span>
        <button
          onClick={() => handlePageChange('next')}
          disabled={currentPage === Math.ceil(nicData.length / itemsPerPage)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-full shadow-md transition-transform transform hover:scale-105 disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Management;
