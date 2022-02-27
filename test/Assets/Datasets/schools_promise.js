/* eslint-disable no-unused-vars */
module.exports = async (context) => {
  const fs = require('fs'); // <- this should not crash
  return [
    {
      id: 1,
      name: 'Harvard University',
    },
    {
      id: 2,
      name: 'Massachusetts Institute of Technology',
    },
    {
      id: 3,
      name: 'Stanford University',
    },
    {
      id: 4,
      name: 'University of California, Berkeley',
    },
    {
      id: 5,
      name: 'University of Oxford',
    },
    {
      id: 6,
      name: 'Columbia University',
    },
    {
      id: 7,
      name: 'University of Washington, Seattle',
    },
    {
      id: 8,
      name: 'University of Cambridge',
    },
    {
      id: 9,
      name: 'California Institute of Technology',
    },
    {
      id: 10,
      name: 'Johns Hopkins University',
    },
  ];
};
