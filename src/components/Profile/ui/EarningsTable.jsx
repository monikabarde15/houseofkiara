import React from 'react';
import "../../../styles/Profile/ui/EarningsTable.css";

const EarningsTable = ({ bookings, totalEarned, pendingAmount }) => {
  // Calculate total paid (excluding pending)
  const totalPaid = totalEarned - (pendingAmount || 0);

  return (
    <div className="profile-earnings-table-container">
      <div className="profile-earnings-table-title">Booking History</div>
      <table className="profile-earnings-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Your Earnings</th>
          </tr>
        </thead>
        <tbody>
          {bookings && bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <tr key={index}>
                <td>{booking.date}</td>
                <td>{booking.customer}</td>
                <td>₹{booking.earnings.toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="profile-earnings-empty">
                No booking history available
              </td>
            </tr>
          )}
        </tbody>
        {bookings && bookings.length > 0 && (
          <tfoot>
            <tr className="profile-earnings-table-total">
              <td colSpan="2">Total</td>
              <td>
                ₹{totalPaid.toLocaleString()}
                {pendingAmount > 0 && (
                  <span className="profile-earnings-pending"> + ₹{pendingAmount.toLocaleString()} pending</span>
                )}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default EarningsTable;