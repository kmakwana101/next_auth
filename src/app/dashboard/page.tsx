'use client';
import useApiData from '@/helpers/useApiData';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie'

const Page = () => {

    const router = useRouter(); 
    const { data: dashboardData, loading, accessToken } = useApiData('/api/dashboard', 'POST');

    const handleLogout = async () => {
        try {
            const response = await axios.post('/api/logout', null, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            if (response?.status === 200) {
                Cookies.remove('accessToken')
                toast.success('Logout successful. Redirecting...');
                router.push('/'); // Change this line to redirect to the dashboard
            } else {
                toast.error('Logout failed. Please try again.');
            }
        } catch (error: any) {
            toast.error('An error occurred during logout: ' + (error.message || 'Unknown error'));
        }
    };


    if (loading) {
        return <div>Loading...</div>; // Consider using a spinner here
    }

    return (
        <div>
            <h1>Dashboard</h1>
            {dashboardData ? (
                <div>
                    {/* Render your dashboard data here */}
                    <pre>{JSON.stringify(dashboardData, null, 2)}</pre>
                </div>
            ) : (
                <div>No data available</div>
            )}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Page;
