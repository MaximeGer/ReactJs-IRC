import axios from "axios";

const API_URL = "http://localhost:9000/api/auth/";

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          sessionStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    sessionStorage.removeItem("user");
  }

  register(username, password) {
    return axios.post(API_URL + "signup", {
      username,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('user'));
  }

  changeUsername(newUsername){
    var user = JSON.parse(sessionStorage.getItem('user'));
    user.username = newUsername;
    sessionStorage.setItem("user", JSON.stringify(user));
  }
}

export default new AuthService();