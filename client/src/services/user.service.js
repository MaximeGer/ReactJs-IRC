import axios from 'axios';

const API_URL = 'http://localhost:9000/api/users/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'test'); 
  }
}

export default new UserService();