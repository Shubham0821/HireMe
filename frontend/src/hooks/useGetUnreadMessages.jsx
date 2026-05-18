import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUnreadCount } from "../redux/messageSlice";
import api from "../services/api";

const useGetUnreadMessages = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth) || {};

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const res = await api.get('/message/contacts');
                if (res.data.success) {
                    const totalUnread = res.data.contacts.reduce((acc, contact) => acc + (contact.unread || 0), 0);
                    dispatch(setUnreadCount(totalUnread));
                }
            } catch (error) {
                console.error("Failed to fetch unread messages count:", error);
            }
        };

        if (user) {
            fetchUnreadCount();
            const intervalId = setInterval(fetchUnreadCount, 15000); // Check every 15s
            return () => clearInterval(intervalId);
        }
    }, [dispatch, user]);
};

export default useGetUnreadMessages;
