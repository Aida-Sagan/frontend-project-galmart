import RegistrationForm from '../../components/auth/RegistrationForm';
import RegistrationPromo from '../../components/auth/RegistrationPromo.jsx';
import '../../styles/RegistrationPage.css';

export default function RegistrationPage() {
    return (
        <div className="registration-wrapper">
            <div className="registration-form-block">
                <h2 className="registration-title">Регистрация</h2>
                <RegistrationForm />
            </div>

            <RegistrationPromo />
        </div>
    )
}
