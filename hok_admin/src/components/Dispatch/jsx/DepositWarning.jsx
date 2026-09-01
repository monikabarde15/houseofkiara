import './../css/DepositWarning.css';

export default function DepositWarning({ amount }) {
  return (
    <div className="deposit-warning">
      <span className="deposit-warning-icon">⚠</span>
      <span>
        Deposit ₹{Number(amount).toLocaleString('en-IN')} not yet collected — record it on the order
        before this piece leaves the studio. Mark Dispatched will ask for an explicit override.
      </span>
    </div>
  );
}