// src\components\Profile\panels\RentalDetailPanel.jsx
import React from 'react';
import { X } from 'lucide-react';
import "../../../styles/Profile/panels/RentalDetailPanel.css";
import { useState } from 'react';
import CancelBookingModal from '../modals/CancelBookingModal';
import Toast from '../ui/Toast';

const RentalDetailPanel = ({ booking, isOpen, onClose }) => {
    if (!booking) return null;

    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    const handleCancelBooking = () => {
        setIsCancelModalOpen(true);
    };

    const handleConfirmCancel = () => {
        setIsCancelModalOpen(false);
        setToastMessage("Cancellation request submitted — our team will be in touch");
        setShowToast(true);
    };

    return (
        <div className={`profile-rental-dpane ${isOpen ? 'open' : ''}`}>
            <div className="profile-rental-dpn">
                <div className="profile-rental-dpn-title">{booking.piece}</div>
                <button className="profile-rental-dpn-close" onClick={onClose}>
                    Close
                    <X size={12} strokeWidth={1.5} />
                </button>
            </div>

            <div className="profile-rental-dpb">
                <div className="profile-rental-dp-img-cell">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="4" y="4" width="24" height="24" stroke="currentColor" strokeWidth="1" opacity="0.18" />
                    </svg>
                </div>

                <div className="profile-rental-dp-info">
                    <div className="profile-rental-dp-badge-row">
                        {/* Dispatched Status Badage*/}
                        {booking.status === 'Dispatched' && (
                            <div className="profile-rental-badge profile-rental-b-dis">
                                <span className="profile-rental-bdot"></span>
                                Dispatched
                            </div>
                        )}

                        {/* Confirmed Status Badage*/}
                        {booking.status === 'Confirmed' && (
                            <div className="profile-rental-badge profile-rental-b-con">
                                <span className="profile-rental-bdot"></span>
                                Confirmed
                            </div>
                        )}

                        {/* Completed Status Badage*/}
                        {booking.status === 'Completed' && (
                            <div className="profile-rental-badge profile-rental-b-com">
                                <span className="profile-rental-bdot"></span>
                                Completed
                            </div>
                        )}

                        {/* Returned Status Badage*/}
                        {booking.status === 'Returned' && (
                            <div className="profile-rental-badge profile-rental-b-ret">
                                <span className="profile-rental-bdot"></span>
                                Returned
                            </div>
                        )}

                        {/* Cancelled Status Badage  */}
                        {booking.status === 'Cancelled' && (
                            <div className="profile-rental-badge profile-rental-b-can">
                                <span className="profile-rental-bdot"></span>
                                Cancelled
                            </div>
                        )}

                    </div>

                    <div className="profile-rental-dp-name">{booking.piece}</div>
                    <div className="profile-rental-dp-des">{booking.designer}</div>

                    {/* Dispatched  */}
                    {booking.status === 'Dispatched' && (
                        <>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Booking ID</div>
                                <div className="profile-rental-dp-rv">{booking.id}</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Rental Dates</div>
                                <div className="profile-rental-dp-rv">{booking.dates}</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Size</div>
                                <div className="profile-rental-dp-rv">M</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Rental Fee</div>
                                <div className="profile-rental-dp-rv">₹{booking.fee.toLocaleString()}</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Security Deposit</div>
                                <div className="profile-rental-dp-rv profile-rental-dp-rv-pending">₹15,000 Pending refund</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Delivery Address</div>
                                <div className="profile-rental-dp-rv">204, Suncity Towers, Vijay Nagar, Indore MP 452001</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Return By</div>
                                <div className="profile-rental-dp-rv">28 May 2025</div>
                            </div>

                            <div className="profile-rental-dp-note">
                                <div className="profile-rental-dp-note-h">Return Instructions</div>
                                <div className="profile-rental-dp-note-t">
                                    Pack in the original dust bag and Whatsapp us to schedule a pickup. Deposit refunded within 3-5 business days after inspection.
                                </div>
                            </div>

                            <div className="profile-rental-dp-btns">
                                <button className="profile-rental-btn-p">WhatsApp Support</button>
                                <button className="profile-rental-btn-s">Email Instructions</button>
                            </div>
                        </>
                    )}

                    {/* Confirmed */}
                    {booking.status === 'Confirmed' && (
                        <>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Booking ID</div>
                                <div className="profile-rental-dp-rv">{booking.id}</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Rental Dates</div>
                                <div className="profile-rental-dp-rv">{booking.dates}</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Size</div>
                                <div className="profile-rental-dp-rv">M</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Rental Fee</div>
                                <div className="profile-rental-dp-rv">₹{booking.fee.toLocaleString()}</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Deposit Due</div>
                                <div className="profile-rental-dp-rv profile-rental-dp-rv-pending">₹8,000 Due at pickup</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Expected Dispatch</div>
                                <div className="profile-rental-dp-rv">Within 3-5 business days</div>
                            </div>

                            <div className="profile-rental-dp-note gold">
                                <div className="profile-rental-dp-note-h">What Happens Next</div>
                                <div className="profile-rental-dp-note-t">
                                    Your garment will be dispatched within 3-5 business days. You will receive a WhatsApp notification with tracking details once shipped.
                                </div>
                            </div>

                            <div className="profile-rental-dp-btns">
                                <button className="profile-rental-btn-p">Contact Us</button>
                                <button className="profile-rental-btn-s" onClick={handleCancelBooking}>Cancel Booking</button>
                            </div>

                            <CancelBookingModal
                                isOpen={isCancelModalOpen}
                                onClose={() => setIsCancelModalOpen(false)}
                                onConfirm={handleConfirmCancel}
                                bookingDetails={{ fee: booking.fee }}
                            />

                            <Toast
                                message={toastMessage}
                                isVisible={showToast}
                                onClose={() => setShowToast(false)}
                            />
                        </>
                    )}

                    {/* Completed */}
                    {booking.status === 'Completed' && (
                        <>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Booking ID</div>
                                <div className="profile-rental-dp-rv">{booking.id}</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Rental Dates</div>
                                <div className="profile-rental-dp-rv">{booking.dates}</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Rental Fee</div>
                                <div className="profile-rental-dp-rv">₹{booking.fee.toLocaleString()}</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Security Deposit</div>
                                <div className="profile-rental-dp-rv profile-rental-dp-rv-refunded">₹15,000 Refunded 20 Feb 2025</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Return Condition</div>
                                <div className="profile-rental-dp-rv">Excellent — no damage noted</div>
                            </div>

                            <div className="profile-rental-dp-btns">
                                <button className="profile-rental-btn-s">Rent Again</button>
                            </div>
                        </>
                    )}

                    {/* Returned */}
                    {booking.status === 'Returned' && (
                        <>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Booking ID</div>
                                <div className="profile-rental-dp-rv">{booking.id}</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Rental Dates</div>
                                <div className="profile-rental-dp-rv">{booking.dates}</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Rental Fee</div>
                                <div className="profile-rental-dp-rv">₹{booking.fee.toLocaleString()}</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Security Deposit</div>
                                <div className="profile-rental-dp-rv profile-rental-dp-rv-refunded">₹15,000 Refunded 25 Jan 2025</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Return Condition</div>
                                <div className="profile-rental-dp-rv">Good — minor hem wear noted</div>
                            </div>

                            <div className="profile-rental-dp-btns">
                                <button className="profile-rental-btn-s">Rent Again</button>
                            </div>
                        </>
                    )}

                    {/* Cancelled*/}
                    {booking.status === 'Cancelled' && (
                        <>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Booking ID</div>
                                <div className="profile-rental-dp-rv">{booking.id}</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Requested Dates</div>
                                <div className="profile-rental-dp-rv">{booking.dates}</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Size</div>
                                <div className="profile-rental-dp-rv">M</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Rental Fee</div>
                                <div className="profile-rental-dp-rv profile-rental-dp-rv-cancelled">₹{booking.fee.toLocaleString()}</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Cancellation Date</div>
                                <div className="profile-rental-dp-rv">1 Dec 2024</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Cancelled By</div>
                                <div className="profile-rental-dp-rv">Customer</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Reason</div>
                                <div className="profile-rental-dp-rv">Event rescheduled</div>
                            </div>
                            <div className="profile-rental-dp-row">
                                <div className="profile-rental-dp-rl">Refund Status</div>
                                <div className="profile-rental-dp-rv profile-rental-dp-rv-refunded">Full refund — processed 6 Dec 2024</div>
                            </div>

                            <div className="profile-rental-dp-note">
                                <div className="profile-rental-dp-note-h">Cancellation Policy Applied</div>
                                <div className="profile-rental-dp-note-t">
                                    Full refund processed as per cancellation policy. Amount will reflect in your original payment method within 5-7 business days.
                                </div>
                            </div>

                            <div className="profile-rental-dp-btns">
                                <button className="profile-rental-btn-s">Browse Similar Pieces</button>
                            </div>
                        </>
                    )}


                </div>
            </div>
        </div>
    );
};

export default RentalDetailPanel;