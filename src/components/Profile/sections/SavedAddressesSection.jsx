import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import AddressCard from '../cards/AddressCard';
import AddAddressForm from '../forms/AddAddressForm';
import EditAddressModal from '../modals/EditAddressModal';
import DeleteAddressModal from '../modals/DeleteAddressModal';
import Toast from '../ui/Toast';
import useAuthStore from '../../../store/authStore';
import "../../../styles/Profile/sections/SavedAddressesSection.css";

const SavedAddressesSection = () => {
  const { user, token, setUser } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [addresses, setAddresses] = useState(user?.addresses || []);

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  // Fetch addresses from API on mount
  useEffect(() => {
    if (!token) return;
    fetch('/api/customer/addresses', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setAddresses(res.data);
          setUser((prev) => ({ ...prev, addresses: res.data }));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch customer addresses:", err);
      });
  }, [token, setUser]);

  // Set Default Address Logic
  const handleSetDefault = async (address) => {
    try {
      const response = await fetch(`/api/customer/addresses/${address.id}/default`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      if (res.success) {
        setAddresses(res.data);
        setUser((prev) => ({ ...prev, addresses: res.data }));
        showToastMessage('Default address updated');
      } else {
        showToastMessage(res.message || 'Failed to update default address');
      }
    } catch (err) {
      showToastMessage('Network error updating default address');
    }
  };

  // Edit Address
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
        showToastMessage('Address updated successfully');
      } else {
        showToastMessage(res.message || 'Failed to update address');
      }
    } catch (err) {
      showToastMessage('Network error updating address');
    }
    setIsEditModalOpen(false);
    setSelectedAddress(null);
  };

  // Delete Address Flow
  const handleDelete = (address) => {
    setSelectedAddress(address);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAddress) return;
    try {
      const response = await fetch(`/api/customer/addresses/${selectedAddress.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      if (res.success) {
        setAddresses(res.data);
        setUser((prev) => ({ ...prev, addresses: res.data }));
        showToastMessage('Address removed');
      } else {
        showToastMessage(res.message || 'Failed to delete address');
      }
    } catch (err) {
      showToastMessage('Network error deleting address');
    }
    setIsDeleteModalOpen(false);
    setSelectedAddress(null);
  };

  // Add New Address
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleSaveNewAddress = async (newAddress) => {
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
        showToastMessage(newAddress.setAsDefault ? 'New address saved and set as default' : 'New address saved');
      } else {
        showToastMessage(res.message || 'Failed to save address');
      }
    } catch (err) {
      showToastMessage('Network error saving address');
    }
    setShowForm(false);
  };

  return (
    <>
      <div className="profile-saved-addresses-section" id="addresses">
        <div className="profile-addresses-grid">
          {/* Existing Address Cards */}
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              isDefault={address.isDefault}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}

          {/* Add New Address Card */}
          <div className="profile-add-addr-card" onClick={toggleForm}>
            <div className="profile-add-addr-icon">
              <Plus size={14} strokeWidth={1.5} />
            </div>
            <span className="profile-add-addr-title">Add New Address</span>
            <span className="profile-add-addr-sub">Home, office, or any delivery location</span>
          </div>
        </div>

        {/* Add New Address Form - inline */}
        {showForm && (
          <AddAddressForm onClose={toggleForm} onSave={handleSaveNewAddress} />
        )}
      </div>

      {/* Edit Address Modal */}
      <EditAddressModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        address={selectedAddress}
      />

      {/* Delete Address Modal */}
      <DeleteAddressModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        address={selectedAddress}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default SavedAddressesSection;