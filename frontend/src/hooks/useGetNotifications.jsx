import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNotifications } from "../redux/notificationSlice";
import api from "../services/api";

const useGetNotifications = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth) || {};

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get('/notification');
                if (res.data.success) {
                    dispatch(setNotifications(res.data.notifications));
                }
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        };

        if (user) {
            fetchNotifications();
            // Polling every 30 seconds for new notifications
            const intervalId = setInterval(fetchNotifications, 30000);
            return () => clearInterval(intervalId);
        }
    }, [dispatch, user]);
};

export default useGetNotifications;
