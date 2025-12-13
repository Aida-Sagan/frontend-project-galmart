import React, { useState, useEffect, useCallback } from 'react';
import Loader from '../../../components/Loader/Loader.jsx';
import { deleteAddress } from '../../../api/services/addressService.js';
import './style/myAddresses.css';

const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18" stroke="#7A7A7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 6L18 18" stroke="#7A7A7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const formatAddressForDisplay = (address) => {
    if (address.full_address) {

        let display = `${address.address}, ${address.building}`;

        if (address.apartment) {
            display += `, кв ${address.apartment}`;
        } else if (address.floor && !address.private_house) {

            display += address.floor ? `, ${address.floor} этаж` : '';
        }

        if (address.private_house) {
            display += ', частный дом';
        }

        return display;
    }

    return `${address.address}, ${address.building}`;
};


const RadioButton = ({ selected }) => (
    <div className={`address-radio ${selected ? 'selected' : ''}`}>
        {selected && <div className="address-radio-dot"></div>}
    </div>
);

const TrashIcon = () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.8333 13.5833V18.6667" stroke="#7A7A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16.9999 13.5833V18.6667" stroke="#7A7A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3.5 9.75H24.5" stroke="#7A7A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5.33325 9.75V20.4167C5.33325 22.8467 7.23492 24.75 9.66659 24.75H18.3333C20.7633 24.75 22.6666 22.8467 22.6666 20.4167V9.75" stroke="#7A7A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18.8466 5.83333C17.7599 4.805 16.2733 4.16667 13.9999 4.16667C11.7266 4.16667 10.2399 4.805 9.15325 5.83333" stroke="#7A7A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const EditIcon = () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M24.0517 10.4351C25.3046 9.18221 25.3046 7.1508 24.0517 5.89787L22.4018 4.24795C21.1488 2.99502 19.1174 2.99502 17.8645 4.24795L4.91956 17.1929C4.38686 17.7256 4.0586 18.4288 3.99231 19.1792L3.70988 22.3763C3.59805 23.6422 4.65742 24.7016 5.92328 24.5898L9.12044 24.3073C9.87087 24.241 10.574 23.9128 11.1067 23.3801L24.0517 10.4351ZM22.8142 7.13531C23.3838 7.70482 23.3838 8.62819 22.8142 9.1977L21.7063 10.3056L17.994 6.59333L19.1019 5.48539C19.6714 4.91588 20.5948 4.91588 21.1643 5.48539L22.8142 7.13531ZM16.7566 7.83077L20.4689 11.5431L9.86931 22.1426C9.62717 22.3848 9.30755 22.534 8.96644 22.5641L5.76929 22.8465C5.58845 22.8625 5.43712 22.7112 5.45309 22.5303L5.73552 19.3332C5.76566 18.9921 5.91486 18.6725 6.157 18.4303L16.7566 7.83077Z" fill="#7A7A7A"/>
    </svg>
);


const MyAddresses = ({ addresses: groupedAddresses, isLoading, error, onAddressListChange }) => {
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (Array.isArray(groupedAddresses) && groupedAddresses.length > 0 && selectedAddressId === null) {
            for (const group of groupedAddresses) {
                const currentAddress = group.addresses.find(a => a.is_current);
                if (currentAddress) {
                    setSelectedAddressId(currentAddress.id);
                    return;
                }
            }
            if (groupedAddresses[0]?.addresses?.length > 0) {
                setSelectedAddressId(groupedAddresses[0].addresses[0].id);
            }
        }
    }, [groupedAddresses, selectedAddressId]);


    const handleSelectAddress = useCallback((id) => {
        setSelectedAddressId(id);
    }, []);

    const handleDeleteClick = useCallback((address) => {
        setAddressToDelete(address);
        setIsModalOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!addressToDelete) return;

        setIsDeleting(true);
        try {
            const success = await deleteAddress(addressToDelete.id);

            if (success && onAddressListChange) {
                await onAddressListChange();

                if (selectedAddressId === addressToDelete.id) {
                    setSelectedAddressId(null);
                }

                setIsModalOpen(false);
                setAddressToDelete(null);
            } else if (!success) {
                alert('Не удалось удалить адрес. Попробуйте снова.');
            }
        } catch (error) {
            alert('Произошла ошибка при удалении адреса.');
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    }, [addressToDelete, selectedAddressId, onAddressListChange]);

    const handleCancelDelete = useCallback(() => {
        setIsModalOpen(false);
        setAddressToDelete(null);
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <p className="error-message">Ошибка при загрузке данных: {error}</p>;
    }

    // ИСПРАВЛЕНИЕ: Добавление проверки Array.isArray
    const isAddressesEmpty = !Array.isArray(groupedAddresses) || groupedAddresses.length === 0 || groupedAddresses.every(g => g.addresses && g.addresses.length === 0);

    if (isAddressesEmpty) {
        return (
            <div className="my-addresses-section no-data">
                <h2 className="content-title">Мои адреса</h2>
                <p className="no-addresses-message">У вас пока нет сохраненных адресов.</p>
                <button className="add-address-btn">
                    Добавить новый адрес
                </button>
            </div>
        );
    }

    const DeleteModal = () => {
        if (!isModalOpen || !addressToDelete) return null;

        const { city, address, building, apartment, floor } = addressToDelete;

        let displayAddressPart = `${address}, ${building}`;
        if (apartment) {
            displayAddressPart += `, кв ${apartment}`;
        } else if (floor) {
            displayAddressPart += `, ${floor} этаж`;
        }

        return (
            <div className="delete-modal-backdrop">
                <div className="delete-modal-content">
                    <button className="modal-close-btn" onClick={handleCancelDelete}>
                        <CloseIcon />
                    </button>
                    <div className="address-delete-modal">
                        <h3 className="modal-title">Удаление адреса</h3>
                        <p className="modal-text">
                            Вы действительно хотите удалить адрес г. {city}, {displayAddressPart}?
                        </p>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={handleCancelDelete} disabled={isDeleting}>
                                Нет
                            </button>
                            <button className="btn-confirm" onClick={handleConfirmDelete} disabled={isDeleting}>
                                {isDeleting ? 'Удаление...' : 'Да, удалить адрес'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="my-addresses-section">
            <h2 className="content-title">Мои адреса</h2>

            <div className="addresses-list-profile">
                {groupedAddresses.map((group) => (
                    <div key={group.city} className="city-group">
                        <h3 className="city-title">{group.city}</h3>
                        {group.addresses.map(address => {
                            const isSelected = selectedAddressId === address.id;
                            const addressText = formatAddressForDisplay(address);

                            return (
                                <div
                                    key={address.id}
                                    className={`address-item ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleSelectAddress(address.id)}
                                >
                                    <div className="address-info">
                                        <RadioButton selected={isSelected} />
                                        <span className="address-text">
                                            {addressText}
                                        </span>
                                    </div>
                                    <div className="address-actions">
                                        <button className="icon-btn edit-btn" onClick={(e) => {
                                            e.stopPropagation();
                                            console.log('Редактировать адрес:', address.id);
                                        }}>
                                            <EditIcon />
                                        </button>
                                        <button className="icon-btn trash-btn" onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick({
                                                ...address,
                                                city: group.city,
                                            });
                                        }}>
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <button className="add-address-btn">
                Добавить новый адрес
            </button>

            <DeleteModal />
        </div>
    );
};

export default MyAddresses;