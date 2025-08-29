import '../../styles/LoginPage.css';
import EnterCodePromo from "@/components/auth/EnterCodePromo.jsx";
import EnterCodeForm from "@/components/auth/EnterCodeForm.jsx";

export default function EnterCode() {


    return (
        <div className="registration-wrapper">
            <div className="registration-form-block">
                <div className="block-login">
                    <h2 className="registration-title">Введите код</h2>
                    <div className="block-registration-description">
                        <p className="registration-description">
                           Отправили на номер +7 (ХХХ) ХХХ-ХХ-ХХ
                        </p>
                    </div>
                </div>

                <EnterCodeForm/>
            </div>

            <EnterCodePromo />
        </div>
    )
}
