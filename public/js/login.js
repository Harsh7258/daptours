import axios from 'axios';

export const login = async (email, password) => {
    console.log(email, password);
    try {
        const res = await axios({
            method: 'POST',
            url: 'https://127.0.0.1:3000/api/v1/users/login',
            data: {
                 email,
                 password
            }
        });

        if(res.data.status === 'success'){
            console.log('Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
        console.log(res);
    } catch (error) {
        console.log(error.response.data.message);
    }
};
