import axios from 'axios';

var instance = axios.create({
    baseURL: 'https://flythink.cn/SignUp4ExamsServer',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
})


export default instance;