// hooks/useApiData.ts
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface ApiData {
    [key: string]: any; // Adjust this based on your expected data structure
}

const useApiData = (endpoint: string, method: 'GET' | 'POST' = 'GET', payload?: any) => {

    const router = useRouter();
    const [data, setData] = useState<ApiData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [accessToken, setAccessToken] = useState('')

    useEffect(() => {

        const fetchData = async () => {

            const accessToken: any = Cookies.get('accessToken');
            console.log(accessToken,'accessToken')
            setAccessToken(accessToken)

            if (!accessToken) {
                toast.error('Unauthorized access. Redirecting to login.');
                router.push('/'); // Redirect to home if no token exists
                return;
            }

            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };

            try {

                const options = {
                    method,
                    url: endpoint,
                    headers,
                    data: payload, // Include payload for POST requests
                };

                const response = await axios(options);

                if (response.status === 200) {
                    setData(response.data);
                } else {
                    toast.error('Failed to fetch data');
                }

            } catch (error: any) {

                if (axios.isAxiosError(error)) {

                    if (error.response) {

                        if (error.response.status === 401) {

                            toast.error('Session expired. Redirecting to login.');
                            Cookies.remove('accessToken'); // Remove expired token
                            router.push('/'); // Redirect to home on 401

                        } else {
                            toast.error('Failed to fetch data: ' + error.response.data.message || 'An error occurred');
                        }

                    } else {
                        toast.error('No response from server');
                    }

                } else {
                    toast.error('Error: ' + error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, method, payload, router ]);

    return { data, loading , accessToken };
};

export default useApiData;
