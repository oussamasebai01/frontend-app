import axios from "axios";
import { Navigate } from "react-router";
import { toast } from "react-toastify";

const URL_API = 'http://192.168.100.102:4000/registre'

export const createUser = async (payload) => {
    try {
        const response = await axios.post(URL_API, payload);
        if (response.status == 201) {
            toast.success('registration succedded');
        }
        else {
            console.log('error');
        }
        return response;
    } catch (error) {
        console.log(error);
    }
}