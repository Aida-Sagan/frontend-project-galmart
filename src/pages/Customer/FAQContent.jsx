import React, { useState, useCallback, useRef } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import {getQuestionsPageData} from '../../api/services/profileService.js';
import Loader from '../../components/Loader/Loader.jsx';
import './style/FAQContent.css';

const Accordion = ({ title, content, isOpen, setOpenIndex, index }) => {
    const contentRef = useRef(null);

    const toggleAccordion = () => {
        setOpenIndex(isOpen ? null : index);
    };

    const contentStyle = {
        maxHeight: isOpen && contentRef.current ? `${contentRef.current.scrollHeight}px` : '0',
        paddingTop: isOpen ? '10px' : '0',
        paddingBottom: isOpen ? '15px' : '0',
    };

    const formattedContent = content.split('\n').map((line, idx) => (
        <React.Fragment key={idx}>
            {line}
            {idx < content.split('\n').length - 1 && <br />}
        </React.Fragment>
    ));

    return (
        // Условие для добавления класса 'active'
        <div className={`accordion-item ${isOpen ? 'active' : ''}`}>
            <div className="accordion-title" onClick={toggleAccordion}>
                {title}
                <span className="accordion-icon">
                    {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                </span>
            </div>
            <div
                className="accordion-content"
                style={contentStyle}
            >
                <p className="accordion-content-text" ref={contentRef}>
                    {formattedContent}
                </p>
            </div>
        </div>
    );
};

const FAQContent = () => {
    const [faqData, setFaqData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openIndex, setOpenIndex] = useState(null);

    const loadFaqData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getQuestionsPageData();
            setFaqData(data);
        } catch (err) {
            setError('Не удалось загрузить вопросы. Попробуйте обновить страницу.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        loadFaqData();
    }, [loadFaqData]);

    if (isLoading) {
        return (
            <div className="content-page-wrapper">
                <h1 className="content-page-title">Часто задаваемые вопросы</h1>
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="content-page-wrapper">
                <h1 className="content-page-title">Часто задаваемые вопросы</h1>
                <p style={{ color: 'red' }}>{error}</p>
            </div>
        );
    }

    return (
        <div className="content-page-wrapper">
            <h1 className="content-page-title">Часто задаваемые вопросы</h1>
            <div className="accordion-container">
                {faqData.map((item, index) => (
                    <Accordion
                        key={index}
                        title={item.title}
                        content={item.text}
                        isOpen={openIndex === index}
                        setOpenIndex={setOpenIndex}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
};

export default FAQContent;