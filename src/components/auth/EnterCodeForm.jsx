import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/EnterCOdeForm.css';

export default function EnterCodeForm() {
    const navigate = useNavigate();
    const [code, setCode] = useState(['', '', '', '']);
    const [error, setError] = useState(false);
    const [timer, setTimer] = useState(60);
    const inputsRef = useRef([]);

    const correctCode = '1234';

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/, '');

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 3) {
            inputsRef.current[index + 1]?.focus();
        }

        if (index === 3 && newCode.every((digit) => digit !== '')) {
            const joined = newCode.join('');
            if (joined === correctCode) {
                navigate('/profile');
            } else {
                setError(true);
                setTimer(60);
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            const newCode = [...code];

            if (code[index] === '') {
                if (index > 0) {
                    newCode[index - 1] = '';
                    setCode(newCode);
                    inputsRef.current[index - 1]?.focus();
                }
            } else {
                newCode[index] = '';
                setCode(newCode);
            }
        }
    };


    const handleResend = () => {
        if (timer === 0) {
            setCode(['', '', '', '']);
            setError(false);
            setTimer(60);
            inputsRef.current[0]?.focus();
        }
    };

    return (
        <div className="code-wrapper">
            <div className={`code-inputs ${error ? 'error' : ''}`}>
                {code.map((digit, idx) => (
                    <div className="code-box" key={idx}>
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(e, idx)}
                            onKeyDown={(e) => handleKeyDown(e, idx)}
                            ref={(el) => (inputsRef.current[idx] = el)}
                            placeholder="---"
                        />

                    </div>
                ))}
            </div>

            {error && (
                <p className="code-error">Код неверный, попробуйте снова</p>
            )}

            <button
                className="btn-get-code"
                onClick={handleResend}
                disabled={timer > 0}
            >
                {timer > 0 ? `Новый код через 0:${timer.toString().padStart(2, '0')}` : 'Получить новый код'}
            </button>

            <button
                className="btn-back-to-home"
                onClick={() => navigate('/')}
            >
                Вернуться на сайт
            </button>
        </div>
    );
}
