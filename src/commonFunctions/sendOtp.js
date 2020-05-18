let axios = require('axios');

const SendOtp = async (number, msg) => {
  // Account details
	let apiKey = '5bfd187c06292be58f360208bb3cf6c0b504a703ca85179b73b092fe88ab3ee9';
	let username = "darpad2020@gmail.com";
	// Message details
	let numbers = [number];
	let sender = 'TXTLCL';
	let message = msg;
 
	numbers = numbers.join(',');
 
	// Prepare data for POST request
  let data = `username=${username}&hash=${apiKey}&numbers=${numbers}&sender=${sender}&message=${message}`;
  
  return await axios({
    url: 'https://api.textlocal.in/send/?' + data,
    method: 'POST',
  })
  .then((response) => {
    return response.data.status === 'success' ? true : false;
  })
  .catch((err) => {
    return false;
  })
}

module.exports = SendOtp;