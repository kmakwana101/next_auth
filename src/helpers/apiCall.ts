import axios from 'axios';

interface ApiResponse {
    success: boolean;
    data?: any;
}

export const apiCall = async (
    url: string,
    method: string,
    data: object = {},
    headers: object = {}
): Promise<ApiResponse> => {
    try {
        const response = await axios({
            method,
            url,
            data,
            headers, // Include headers in the request configuration
        });
        return response.data; // Return the response data
    } catch (error: any) {
        console.log('API call error:', error); // Log error to console
        if (error && error?.response && error?.response?.data) {
            return error?.response?.data;
        }
        throw new Error(error.response?.data?.message || 'Something went wrong!');
    }
};