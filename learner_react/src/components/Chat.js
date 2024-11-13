import React, {useEffect, useRef, useState} from 'react';
import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';
import axiosInstance from "../pages/axiosInstance";

const Chat = () => {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('chatMessages');
        return savedMessages ? JSON.parse(savedMessages) : [];
    });
    const [isConnected, setIsConnected] = useState(false);
    const stompClient = useRef(null);
    const messageAreaRef = useRef(null);

    const checkUser = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const response = await axiosInstance.get('/token/decode', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsername(response.data.username);
            }
        } catch (error) {
            console.error("토큰 확인 중 오류 발생:", error);
        }
    };

    const connect = async () => {
        await checkUser();
        const token = localStorage.getItem('accessToken');
        const socket = new SockJS(`http://localhost:8080/ws?token=${encodeURIComponent(token)}`);

        stompClient.current = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                'Authorization': `Bearer ${token}`
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str) => {
                console.log(str);
            }
        });

        stompClient.current.onConnect = (frame) => {
            console.log('Connected:', frame);
            onConnected();
        };

        stompClient.current.onStompError = (frame) => {
            console.error('Broker reported error:', frame.headers['message']);
            console.error('Additional details:', frame.body);
            onError(frame);
            setIsConnected(false);
        };

        stompClient.current.activate();
    };

    const onConnected = () => {
        try {
            stompClient.current.subscribe('/sub/chat', onMessageReceived);

            // 페이지 새로고침 여부 확인
            const isRefresh = performance.navigation.type === performance.navigation.TYPE_RELOAD;

            if (!isRefresh) {
                stompClient.current.publish({
                    destination: "/pub/chat/enter",
                    body: JSON.stringify({
                        sender: username,
                        type: 'JOIN',
                        // content: `${username}님이 입장하셨습니다.`,
                        timestamp: new Date().getTime()
                    })

                });
            }
            setIsConnected(true);

        } catch (error) {
            console.error('Subscribe error:', error);
            setIsConnected(false);
        }
    };

    const onError = (error) => {
        console.error('Could not connect to WebSocket server. Please refresh this page to try again!', error);
    };

    const sendMessage = (event) => {
        event.preventDefault();
        if (message.trim() && stompClient.current && stompClient.current.connected) {
            const chatMessage = {
                sender: username,
                content: message,
                type: 'CHAT',
                timestamp: new Date().getTime()
            };

            try {
                stompClient.current.publish({
                    destination: "/pub/chat/message",
                    body: JSON.stringify(chatMessage)
                });
                setMessage('');
            } catch (error) {
                console.error('Message send error:', error);
            }
        }
    };

    const onMessageReceived = (payload) => {
        const receivedMessage = JSON.parse(payload.body);
        setMessages(prevMessages => {
            const newMessages = [...prevMessages, receivedMessage];
            localStorage.setItem('chatMessages', JSON.stringify(newMessages));
            return newMessages;
        });
    };

    useEffect(() => {
        connect();
        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
                localStorage.setItem('chatMessages', JSON.stringify(messages));
            }
        };
    });

    useEffect(() => {
        if (messageAreaRef.current) {
            messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
        }
    }, [messages]);

    // 메시지 저장 기능 추가
    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);

    // 채팅방 나갈 때 메시지 저장
    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.setItem('chatMessages', JSON.stringify(messages));
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [messages]);

    return (
        <div>
            <h1>Chat Application</h1>

            <div ref={messageAreaRef} style={{
                height: '500px',
                overflowY: 'auto',
                border: '1px solid #ccc',
                padding: '10px',
                marginBottom: '20px',
                backgroundColor: '#f9f9f9'
            }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{
                        margin: '10px 0',
                        textAlign: msg.sender === username ? 'right' : 'left'
                    }}>
                        <div style={{
                            display: 'inline-block',
                            maxWidth: '70%',
                            padding: '8px 15px',
                            borderRadius: '15px',
                            backgroundColor: msg.sender === username ? '#4CAF50' : '#e9ecef',
                            color: msg.sender === username ? 'white' : 'black'
                        }}>
                            {msg.type === 'JOIN' || msg.type === 'LEAVE' ? (
                                <div style={{textAlign: 'center', color: '#666'}}>
                                    {msg.content}
                                </div>
                            ) : (
                                <>
                                    <strong>{msg.sender}님: </strong>
                                    <span>{msg.content}</span>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {isConnected ? (
                <form onSubmit={sendMessage} style={{display: 'flex', gap: '10px'}}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ddd'
                        }}
                        placeholder="메시지를 입력하세요..."
                    />
                    <button
                        type="submit"
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        전송
                    </button>
                </form>
            ) : (
                <p>채팅 연결 중...</p>
            )}
        </div>
    );
};

export default Chat;