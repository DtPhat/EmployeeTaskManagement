const generateAccessCode = () => {
  return Math.random().toString(36).substring(2, 8);
}

const generateVerificationToken = () => {
  return Math.random().toString(36).substring(2, 12);
}

module.exports = {
  generateAccessCode,
  generateVerificationToken
}
