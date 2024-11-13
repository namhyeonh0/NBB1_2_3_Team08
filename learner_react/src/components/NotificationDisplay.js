import React, {useEffect} from "react";
import {useNotification} from "./NotificationContext";

const NotificationDisplay = () => {
    const {notifications} = useNotification();

    useEffect(() => {
        console.log("현재 알림:", notifications); // 상태 확인
    }, [notifications]);

    return (
        <div>
            {notifications.length === 0 ? (
                <p>No notifications</p>
            ) : (
                notifications.map((notification, index) => (
                    <div key={index}>
                        <h4>{notification.title}</h4>
                        <p>{notification.content}</p> {/* content로 변경 */}
                    </div>
                ))
            )}
        </div>
    );
};

export default NotificationDisplay;
