import axios from "axios";
import { showAlert } from "./alert";

// data can either be 'password' or 'data
export const updateSettings = async(data, type) => {
    const url = type === 'password' ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword' : 'http://127.0.0.1:3000/api/v1/users/updateMe';
    try {
        const res = await axios({
            method: 'PATCH',
            url: url,
            data: data
        });

        if(res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} updated successfully!`);
        }
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
}