const getNicDetails = (nic) => {
  let year, days, gender;

  // Validate the NIC format: must be a string or integer, and either 10 or 12 characters long
  if ((typeof nic !== 'string' && typeof nic !== 'int') || (nic.length !== 10 && nic.length !== 13)) {
    console.warn(`Invalid NIC format: ${nic}`);
    return null;
  }

  // Handling old NIC format (10 characters)
  if (nic.length === 10) {
    year = `19${nic.substring(0, 2)}`; 
    days = parseInt(nic.substring(2, 5)); 
  } 
  // Handling new NIC format (12 characters)
  else if (nic.length === 13) {
    year = nic.substring(0, 4); 
    days = parseInt(nic.substring(4, 7)); 
  }

  // Determine gender based on day count (days > 500 means Female, otherwise Male)
  gender = days > 500 ? 'Female' : 'Male';
  days = gender === 'Female' ? days - 500 : days; 

  // Validate the derived day count (should be between 1 and 366, inclusive)
  if (days < 1 || days > 366) {
    console.warn(`Invalid day value derived from NIC: ${nic}`);
    return null;
  }

  // Calculate the birth date using the year and day count
  const birthDate = new Date(year, 0, days);
  const age = new Date().getFullYear() - birthDate.getFullYear(); 

  // Check if the birth date is valid
  if (isNaN(birthDate.getTime())) {
    console.error(`Invalid birthDate calculated for NIC: ${nic}`);
    return null;
  }

  // Return the extracted details as an object
  return {
    nic_number: nic, 
    birthday: birthDate.toISOString().split('T')[0], 
    age, 
    gender 
  };
};

module.exports = { getNicDetails };

