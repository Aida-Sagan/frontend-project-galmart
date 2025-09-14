import { useLocation } from 'react-router-dom';
import '../../styles/LoginPage.css';
import './styles/EnterCode.css';

import EnterCodePromo from "@/components/auth/EnterCodePromo.jsx";
import EnterCodeForm from "@/components/auth/EnterCodeForm.jsx";

export default function EnterCode() {
    const location = useLocation();
    const phoneNumber = location.state?.phoneNumber || 'номер не найден';

    return (
        <div className="registration-wrapper">
            <div className="registration-form-block">
                <div className="block-login">
                    <h2 className="registration-title">Введите код</h2>
                    <div className="block-registration-description">
                        <p className="sent-number-text">
                            {/* 4. Отображаем полученный номер */}
                            Отправили на номер {phoneNumber}
                        </p>
                    </div>
                </div>

                <EnterCodeForm phone={phoneNumber} />
            </div>

            <EnterCodePromo />
        </div>
    );
}