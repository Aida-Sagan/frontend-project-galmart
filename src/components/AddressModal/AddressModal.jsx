import React, { useState } from "react";
import { X } from "lucide-react";
import "./styles/AddressModal.css";
import mapImage from '../../assets/map.png';


export default function AddressModal({ isOpen, onClose, onSelectAddress }) {
    const [address, setAddress] = useState("");
    const [isPrivateHouse, setIsPrivateHouse] = useState(false);
    const [apartment, setApartment] = useState("");
    const [entrance, setEntrance] = useState("");
    const [floor, setFloor] = useState("");
    const [comment, setComment] = useState("");

    if (!isOpen) return null;

    const handleSubmit = () => {
        const fullAddress = `${address}${
            isPrivateHouse ? " (частный дом)" : ""
        } ${apartment && !isPrivateHouse ? `, кв/офис: ${apartment}` : ""}${
            entrance && !isPrivateHouse ? `, подъезд: ${entrance}` : ""
        }${floor && !isPrivateHouse ? `, этаж: ${floor}` : ""}${comment ? `, коммент: ${comment}` : ""}`;

        onSelectAddress(fullAddress.trim().replace(/,$/, ''));
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-map">
                    <img src={mapImage} alt="Mock map" className="map-image" />
                </div>

                <div className="modal-form">
                    <div className="modal-header">
                        <h2>Адрес доставки</h2>
                        <button className="close-btn" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="form-fields">
                        <div className="form-group form-group-select">
                            <select id="city" className="form-input" defaultValue="Астана">
                                <option>Астана</option>
                                <option>Алматы</option>
                                <option>Шымкент</option>
                            </select>
                            <label htmlFor="city">Город</label>
                        </div>

                        <div className="form-group">
                            <input
                                id="address"
                                type="text"
                                placeholder=" "
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="form-input"
                            />
                            <label htmlFor="address">Улица, номер дома</label>
                        </div>

                        <label className="checkbox-container">
                            Это частный дом
                            <input
                                type="checkbox"
                                checked={isPrivateHouse}
                                onChange={() => setIsPrivateHouse(!isPrivateHouse)}
                            />
                            <span className="checkmark"></span>
                        </label>

                        {!isPrivateHouse && (
                            <div className="form-grid">
                                <div className="form-group">
                                    <input
                                        id="apartment"
                                        type="text"
                                        placeholder=" "
                                        value={apartment}
                                        onChange={(e) => setApartment(e.target.value)}
                                        className="form-input"
                                    />
                                    <label htmlFor="apartment">Кв/офис</label>
                                </div>
                                <div className="form-group">
                                    <input
                                        id="entrance"
                                        type="text"
                                        placeholder=" "
                                        value={entrance}
                                        onChange={(e) => setEntrance(e.target.value)}
                                        className="form-input"
                                    />
                                    <label htmlFor="entrance">Подъезд</label>
                                </div>
                                <div className="form-group">
                                    <input
                                        id="floor"
                                        type="text"
                                        placeholder=" "
                                        value={floor}
                                        onChange={(e) => setFloor(e.target.value)}
                                        className="form-input"
                                    />
                                    <label htmlFor="floor">Этаж</label>
                                </div>
                            </div>
                        )}

                        {/* Comment field */}
                        <div className="form-group">
                            <textarea
                                id="comment"
                                placeholder=" "
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="form-input"
                                rows={3}
                            />
                            <label htmlFor="comment">Комментарий для курьера</label>
                        </div>

                        <button onClick={handleSubmit} className="btn-submit">
                            Выбрать этот адрес
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
