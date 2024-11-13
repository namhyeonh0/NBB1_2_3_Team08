import React, {useState} from "react";
import {useNotification} from "./NotificationContext";

const SendNotificationComponent = () => {
    const {setNotifications} = useNotification();
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const sendNotification = async () => {
        try {
            const response = await fetch("http://localhost:8080/notifications/notify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include", // 쿠키를 포함하여 요청 보내기
                body: JSON.stringify({
                    memberId: localStorage.getItem("memberId"),
                    title,
                    message
                })
            });

            if (!response.ok) {
                throw new Error("Failed to send notification");
            } else {
                console.log("response", response);
            }

            // 전송한 알림을 UI에 즉시 반영
            setNotifications(prev => [...prev, {title, message}]);
            setTitle("");
            setMessage("");
        } catch (error) {
            console.error("알림 전송 실패:", error);
        }
    };

    return (
        <div>
            <h3>Send Notification</h3>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
            />
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message"
            />
            <button onClick={sendNotification}>Send</button>
        </div>
    );
};

export default SendNotificationComponent;
