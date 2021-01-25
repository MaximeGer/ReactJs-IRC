import axios from 'axios';

const API_URL = 'http://localhost:9000/api/test/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }
}

export default new UserService();