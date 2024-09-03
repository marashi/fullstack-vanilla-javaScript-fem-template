import UserRepository from '../repository/userRepository.js';
import UserService from '../service/userService.js';

const generateUserInstance = ({ filePath }) => {
  const userRepository = new UserRepository({ file: filePath });
  return new UserService({ userRepository });
};

export { generateUserInstance };
