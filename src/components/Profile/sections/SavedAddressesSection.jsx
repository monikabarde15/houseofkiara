import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import AddressCard from '../cards/AddressCard';
import AddAddressForm from '../forms/AddAddressForm';
import EditAddressModal from '../modals/EditAddressModal';
import DeleteAddressModal from '../modals/DeleteAddressModal';
import Toast from '../ui/Toast';
import "../../../styles/Profile/sections/SavedAddressesSection.css";

const SavedAddressesSection = () => {
  const [showForm, setShowForm] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Mock data from spec Page 48
  const [addresses, setAddresses] = useState([
    {
      id: "ac-home",
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
      id: "ac-parents",
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

  // Set Default Address Logic
  const handleSetDefault = (address) => {
    setAddresses(prevAddresses =>
      prevAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === address.id
      }))
    );
    showToastMessage('Default address updated');
  };

  // Edit Address
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
    showToastMessage('Address updated successfully');
    setIsEditModalOpen(false);
    setSelectedAddress(null);
  };

  // Delete Address Flow
  const handleDelete = (address) => {
    setSelectedAddress(address);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setAddresses(prevAddresses =>
      prevAddresses.filter(addr => addr.id !== selectedAddress.id)
    );
    showToastMessage('Address removed');
    setIsDeleteModalOpen(false);
    setSelectedAddress(null);
  };

  // Add New Address
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleSaveNewAddress = (newAddress) => {
    const newId = `ac-${Date.now()}`;
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
      showToastMessage('New address saved and set as default');
    } else {
      showToastMessage('New address saved');
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