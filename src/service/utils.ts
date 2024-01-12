export const  generateBankAccountNumber=()=> {
  // Get the current timestamp
  const timestamp = new Date().getTime();

  // Generate a random number between 1000000000 and 9999999999
  const randomPart = Math.floor(Math.random() * 9000000000) + 1000000000;

  // Combine timestamp and random part
  const accountNumber = `${timestamp}${randomPart}`.slice(0, 10);

  return Number(accountNumber);
}


