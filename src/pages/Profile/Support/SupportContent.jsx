import React, { useState } from 'react';
import './styles/SupportContent.css';
import breadImg from '../../../assets/items/bread_png.png';
import fruitsImg from '../../../assets/items/fruits_png.png';
import alcoholImg from '../../../assets/items/alcohol.png';
import juiceImg from '../../../assets/items/juice.png';
import beautyImg from '../../../assets/items/beauty.png';

const SupportContent = () => {
    const [message, setMessage] = useState('');

    const chatMessages = [
        {
            id: 1,
            type: 'incoming',
            text: 'Здравствуйте! Напишите свой вопрос в чат — и мы обязательно ответим. Отдел поддержки работает с 09:00 до 21:00.',
            time: '11:30'
        },
        {
            id: 2,
            type: 'outgoing',
            text: 'Здравствуйте! Я неправильно указала адрес доставки по заказу',
            time: '11:35'
        },
        {
            id: 3,
            type: 'outgoing',
            text: 'Нужна доставка по адресу г. Астана, ул. Конаева 10',
            images: [breadImg, fruitsImg, alcoholImg, juiceImg, beautyImg],
            time: '11:35'
        }
    ];

    return (
        <div className="support-wrapper">
            <h2 className="support-title">Поддержка</h2>

            {/* БЛОК 1: Окно сообщений */}
            <div className="chat-window-container">
                <div className="chat-window">
                    {chatMessages.map((msg) => (
                        <div key={msg.id} className={`message-row ${msg.type}`}>
                            <div className="message-bubble">
                                {msg.text && <p className="message-text">{msg.text}</p>}
                                {msg.images && (
                                    <div className="message-images">
                                        {msg.images.map((img, idx) => (
                                            <img key={idx} src={img} alt="attachment" className="chat-img" />
                                        ))}
                                    </div>
                                )}
                                <span className="message-time">{msg.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* БЛОК 2: Область ввода */}
            <div className="input-area-container">
                <div className="chat-input-area">
                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder="Сообщение..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                    <button className="attach-btn-circle">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="1.5">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                        </svg>
                    </button>
                    <button className="send-btn-circle">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SupportContent;