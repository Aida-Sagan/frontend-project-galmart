import React, { useState, useEffect, useRef } from 'react';
import './styles/SupportContent.css';
import ChatSocketService from '../../../api/services/chatService';
import { getChatHistory } from '../../../api/services/ordersService';
import { useAuth } from '../../../context/AuthContext';
import Loader from '../../../components/Loader/Loader';

const ManagerChatContent = ({ chatKey, orderNumber, onBack }) => {
    const { token } = useAuth();
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const socketServiceRef = useRef(null);
    const scrollRef = useRef(null);

    // 1. Загрузка истории и инициализация сокета
    useEffect(() => {
        const initChat = async () => {
            try {
                const history = await getChatHistory(chatKey);
                setChatMessages(history);
                setIsLoading(false);

                socketServiceRef.current = new ChatSocketService(chatKey, token);
                socketServiceRef.current.start((action, data) => {
                    if (action === 'message') {
                        setChatMessages(prev => [...prev, {
                            id: data.id || Date.now(),
                            type: data.is_my ? 'outgoing' : 'incoming',
                            text: data.text,
                            time: data.created_at || new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                            images: data.images || null
                        }]);
                    }
                });
            } catch (error) {
                console.error("Ошибка инициализации чата:", error);
                setIsLoading(false);
            }
        };

        initChat();

        return () => {
            if (socketServiceRef.current) socketServiceRef.current.stop();
        };
    }, [chatKey, token]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const handleSendMessage = () => {
        if (!message.trim()) return;

        if (socketServiceRef.current) {
            try {
                socketServiceRef.current.sendMessage(message);
                setMessage('');
            } catch (e) {
                console.error("Ошибка при отправке сообщения:", e);
                alert("Ошибка соединения. Попробуйте позже.");
            }
        } else {
            console.warn("Сервис чата еще не готов");
        }
    };
    if (isLoading) return <Loader />;

    return (
        <div className="support-wrapper">
            <div className="chat-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {onBack && (
                    <button onClick={onBack} className="back-btn-simple">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M8.53033 7.46967C8.82322 7.76256 8.82322 8.23744 8.53033 8.53033L5.81066 11.25H20.5C20.9142 11.25 21.25 11.5858 21.25 12C21.25 12.4142 20.9142 12.75 20.5 12.75H5.81066L8.53033 15.4697C8.82322 15.7626 8.82322 16.2374 8.53033 16.5303C8.23744 16.8232 7.76256 16.8232 7.46967 16.5303L3.46967 12.5303C3.17678 12.2374 3.17678 11.7626 3.46967 11.4697L7.46967 7.46967C7.76256 7.17678 8.23744 7.17678 8.53033 7.46967Z" fill="#222222"/>
                        </svg>

                        Вернуться к заказу
                    </button>
                )}
                <h2 className="support-title" style={{ margin: 0 }}>
                    {orderNumber ? `Чат по заказу №${orderNumber}` : 'Чат с менеджером'}
                </h2>
            </div>

            <div className="chat-window-container" ref={scrollRef}>
                <div className="chat-window">
                    {chatMessages.map((msg) => {

                        const msgType = msg.type || (msg.is_my ? 'outgoing' : 'incoming');

                        return (
                            <div key={msg.id} className={`message-row ${msgType}`}>
                                <div className="message-bubble">
                                    {msg.text && <p className="message-text">{msg.text}</p>}
                                    {msg.images && (
                                        <div className="message-images">
                                            {msg.images.map((img, idx) => (
                                                <img key={idx} src={img} alt="attachment" className="chat-img" />
                                            ))}
                                        </div>
                                    )}
                                    <span className="message-time">{msg.time || msg.created_at}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="input-area-container">
                <div className="chat-input-area">
                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder="Сообщение..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                    </div>
                    <button className="attach-btn-circle">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="1.5">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                        </svg>
                    </button>
                    <button
                        className="send-btn-circle"
                        onClick={handleSendMessage}
                        disabled={isLoading}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManagerChatContent;