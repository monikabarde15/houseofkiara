import React, { useState } from 'react';
import MobileSectionLabel from '../ui/MobileSectionLabel';
import MobileAddressRow from '../rows/MobileAddressRow';
import MobileEditAddressModal from '../modals/MobileEditAddressModal';
import MobileDeleteAddressModal from '../modals/MobileDeleteAddressModal';
import MobileAddAddressForm from '../forms/MobileAddAddressForm';
import Toast from '../../ui/Toast';
import "../../../../styles/Profile/mobile/sections/MobileAddressesSection.css";

const MobileAddressesSection = () => {
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addresses, setAddresses] = useState([
        {
            id: "addr-1",
            label: "Home",
            recipientName: "Priya Varma",
            line1: "204, Suncity Towers",
            line2: "Vijay Nagar",
            city: "Indore",
            state: "Madhya Pradesh",
            pin: "452001",
            mobile: "+91 98765 43210",
            isDefault: true
        },
        {
            id: "addr-2",
            label: "Parents' Home",
            recipientName: "Priya Varma",
            line1: "12, Ranjit Nagar",
            line2: "Bhanwarkuan",
            city: "Indore",
            state: "Madhya Pradesh",
            pin: "452015",
            mobile: "+91 98765 43210",
            isDefault: false
        }
    ]);

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };

    const handleEdit = (address) => {
        setSelectedAddress(address);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = (updatedData) => {
        setAddresses(prevAddresses =>
            prevAddresses.map(addr =>
                addr.id === selectedAddress.id
                    ? { ...addr, ...updatedData }
                    : addr
            )
        );
        showToastMessage("Address updated");
        setIsEditModalOpen(false);
        setSelectedAddress(null);
    };

    const handleDelete = (address) => {
        setSelectedAddress(address);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        setAddresses(prevAddresses => prevAddresses.filter(addr => addr.id !== selectedAddress.id));
        showToastMessage("Address removed");
        setIsDeleteModalOpen(false);
        setSelectedAddress(null);
    };

    const handleSetDefault = (address) => {
        const updatedAddresses = addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === address.id
        }));
        setAddresses(updatedAddresses);
        showToastMessage("Default address updated");
    };

    const handleAddNewAddress = (newAddress) => {
        const newId = `addr-${Date.now()}`;
        const addressToAdd = {
            id: newId,
            label: newAddress.label,
            recipientName: newAddress.recipientName,
            line1: newAddress.line1,
            line2: newAddress.line2,
            city: newAddress.city,
            state: newAddress.state,
            pin: newAddress.pin,
            mobile: newAddress.mobile,
            isDefault: newAddress.setAsDefault
        };

        if (newAddress.setAsDefault) {
            setAddresses(prevAddresses =>
                prevAddresses.map(addr => ({ ...addr, isDefault: false }))
            );
        }

        setAddresses(prevAddresses => [...prevAddresses, addressToAdd]);

        if (newAddress.setAsDefault) {
            showToastMessage("New address saved and set as default");
        } else {
            showToastMessage("New address saved");
        }

        setIsAddFormOpen(false);
    };

    return (
        <>
            <div className="profile-mobile-addresses-section">
                <div className="profile-mobile-section-container">
                    <MobileSectionLabel
                        title="SAVED ADDRESSES"
                        count={addresses.length}
                        linkText=""
                    />
                    <div className="profile-mobile-item-block">
                        {addresses.map((address) => (
                            <MobileAddressRow
                                key={address.id}
                                address={address}
                                isDefault={address.isDefault}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onSetDefault={handleSetDefault}
                            />
                        ))}
                    </div>
                </div>

                {/* Add New Address Form - contains its own trigger button */}
                <MobileAddAddressForm
                    isOpen={isAddFormOpen}
                    onClose={() => setIsAddFormOpen(false)}
                    onSave={handleAddNewAddress}
                    onTriggerClick={() => setIsAddFormOpen(!isAddFormOpen)}
                />
            </div>

            <MobileEditAddressModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedAddress(null);
                }}
                onSave={handleSaveEdit}
                address={selectedAddress}
            />

            <MobileDeleteAddressModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedAddress(null);
                }}
                onConfirm={handleConfirmDelete}
                address={selectedAddress}
            />

            <Toast
                message={toastMessage}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </>
    );
};

export default MobileAddressesSection;