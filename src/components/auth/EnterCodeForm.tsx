import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authStore } from '../../stores/authStore';
import { sendLoginCode } from '../../endpoint-service/services/authService';
import { Button } from '../ui';
import './style/EnterCOdeForm.css';

export default function EnterCodeForm({ phone }: { phone?: string } = {}) {
    const navigate = useNavigate();

    const [code, setCode] = useState(['', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [timer, setTimer] = useState(60);
    const inputsRef = useRef([]);

    const isCodeComplete = code.every((digit) => digit !== '');

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleChange = async (e, index) => {
        const value = e.target.value.replace(/\D/, '');

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (error) {
            setError(false);
        }

        if (value && index < 3) {
            inputsRef.current[index + 1]?.focus();
        }

        if (index === 3 && newCode.every((digit) => digit !== '')) {
            await submitCode(newCode);
        }
    };

    const submitCode = async (codeArr: string[]) => {
        const joinedCode = codeArr.join('');
        setIsLoading(true);

        try {
            const unmaskedPhone = authStore.loginPhone.replace(/\D/g, '');
            const result = await authStore.login(unmaskedPhone, joinedCode);
            if (result.is_account_exists) {
                navigate('/profile');
            } else {
                navigate('/register');
            }
        } catch (err) {
            setError(true);
            setCode(['', '', '', '']);
            inputsRef.current[0]?.focus();
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
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


    const handleResend = async () => {
        if (timer === 0) {
            try {
                await sendLoginCode(authStore.loginPhone.replace(/\D/g, ''));
                setCode(['', '', '', '']);
                setError(false);
                setTimer(60);
                inputsRef.current[0]?.focus();
            } catch (err) {
                console.error('Не удалось отправить код повторно', err);
            }
        }
    };

    const handleLogin = async () => {
        if (isCodeComplete && !isLoading) {
            await submitCode(code);
        }
    };

    const formatTimer = () => {
        const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
        const seconds = (timer % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <div className="code-wrapper">
            <div className="code-number-input-section">
                <div className={`code-inputs ${error ? 'error-container' : ''}`}>
                    {code.map((digit, idx) => (
                        <div className="code-box" key={idx}>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e, idx)}
                                onKeyDown={(e) => handleKeyDown(e, idx)}
                                ref={(el: HTMLInputElement | null) => { if (el) inputsRef.current[idx] = el; }}
                                className={error ? 'input-error-state' : ''}
                                placeholder="•"
                                disabled={isLoading}
                            />
                        </div>
                    ))}
                </div>

                {error && !isLoading && (
                    <p className="code-error-message">Код неверный, попробуйте снова</p>
                )}

                <div className="code-timer-row">
                    <span className="code-timer-label">Не получили код?</span>
                    {timer > 0 ? (
                        <span className="code-timer-countdown">Новый через {formatTimer()}</span>
                    ) : (
                        <span className="code-timer-resend" onClick={handleResend}>Отправить снова</span>
                    )}
                </div>
            </div>

            <div className="code-buttons">
                <Button
                    variant="filled"
                    fullWidth
                    onClick={handleLogin}
                    disabled={!isCodeComplete || isLoading}
                >
                    {isLoading ? 'Проверка...' : 'Войти'}
                </Button>

                <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate('/')}
                >
                    Вернуться на сайт
                </Button>
            </div>
            {isLoading && <div className="loading-overlay">Проверка кода...</div>}

        </div>
    );
}