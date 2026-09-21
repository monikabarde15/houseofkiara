import React, { useState, useEffect } from 'react';
import MobileSectionLabel from '../ui/MobileSectionLabel';
import MobileAddressRow from '../rows/MobileAddressRow';
import MobileEditAddressModal from '../modals/MobileEditAddressModal';
import MobileDeleteAddressModal from '../modals/MobileDeleteAddressModal';
import MobileAddAddressForm from '../forms/MobileAddAddressForm';
import Toast from '../../ui/Toast';
import useAuthStore from '../../../../store/authStore';
import "../../../../styles/Profile/mobile/sections/MobileAddressesSection.css";

const MobileAddressesSection = () => {
    const { user, token, setUser } = useAuthStore();
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addresses, setAddresses] = useState(user?.addresses || []);

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };

    useEffect(() => {
        if (!token) return;
        fetch('/api/customer/addresses', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.success && Array.isArray(res.data)) {
                    setAddresses(res.data);
                    setUser((prev) => ({ ...prev, addresses: res.data }));
                }
            })
            .catch((err) => console.error("Failed to load addresses:", err));
    }, [token, setUser]);

    const handleEdit = (address) => {
        setSelectedAddress(address);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async (updatedData) => {
        if (!selectedAddress) return;
        try {
            const response = await fetch(`/api/customer/addresses/${selectedAddress.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });
            const res = await response.json();
            if (res.success) {
                setAddresses(res.data);
                setUser((prev) => ({ ...prev, addresses: res.data }));
                showToastMessage("Address updated");
            } else {
                showToastMessage(res.message || "Failed to update address");
            }
        } catch (err) {
            showToastMessage("Network error");
        }
        setIsEditModalOpen(false);
        setSelectedAddress(null);
    };

    const handleDelete = (address) => {
        setSelectedAddress(address);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedAddress) return;
        try {
            const response = await fetch(`/api/customer/addresses/${selectedAddress.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            const res = await response.json();
            if (res.success) {
                setAddresses(res.data);
                setUser((prev) => ({ ...prev, addresses: res.data }));
                showToastMessage("Address removed");
            } else {
                showToastMessage(res.message || "Failed to remove address");
            }
        } catch (err) {
            showToastMessage("Network error");
        }
        setIsDeleteModalOpen(false);
        setSelectedAddress(null);
    };

    const handleSetDefault = async (address) => {
        try {
            const response = await fetch(`/api/customer/addresses/${address.id}/default`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });
            const res = await response.json();
            if (res.success) {
                setAddresses(res.data);
                setUser((prev) => ({ ...prev, addresses: res.data }));
                showToastMessage("Default address updated");
            } else {
                showToastMessage(res.message || "Failed to update default address");
            }
        } catch (err) {
            showToastMessage("Network error");
        }
    };

    const handleAddNewAddress = async (newAddress) => {
        try {
            const response = await fetch('/api/customer/addresses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    label: newAddress.label,
                    recipientName: newAddress.recipientName,
                    line1: newAddress.line1,
                    line2: newAddress.line2,
                    city: newAddress.city,
                    state: newAddress.state,
                    pin: newAddress.pin,
                    mobile: newAddress.mobile,
                    isDefault: Boolean(newAddress.setAsDefault),
                }),
            });
            const res = await response.json();
            if (res.success) {
                setAddresses(res.data);
                setUser((prev) => ({ ...prev, addresses: res.data }));
                showToastMessage(newAddress.setAsDefault ? "New address saved and set as default" : "New address saved");
            } else {
                showToastMessage(res.message || "Failed to save address");
            }
        } catch (err) {
            showToastMessage("Network error");
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

                {/* Add New Address Form */}
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