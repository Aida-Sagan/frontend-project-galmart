import { useLocation } from 'react-router-dom';
import '../../styles/LoginPage.css';
import './styles/EnterCode.css';

import EnterCodePromo from "@/components/auth/EnterCodePromo";
import EnterCodeForm from "@/components/auth/EnterCodeForm";

export default function EnterCode(): any {
    const location = useLocation();
    const phoneNumber = location.state?.phoneNumber || 'номер не найден';

    return (
        <div className="registration-wrapper">
            <div className="registration-form-block">
                <div className="enter-code-content">
                    <div className="enter-code-header">
                        <h2 className="registration-title">Введите код</h2>
                        <p className="sent-number-text">
                            Отправили на {phoneNumber}
                        </p>
                    </div>

                    <EnterCodeForm phone={phoneNumber} />
                </div>
            </div>

            <EnterCodePromo />
        </div>
    );
}