// ProgressStrip.jsx

import "../../../styles/checkout/layout/progress-strip.css";
import { Check } from 'lucide-react';

const ProgressStrip = () => {
  return (
    <div className="progress-strip">
      <div className="progress-inner">

        {/* Step 1 */}
        <a href="/cart" className="prog-step done">
          <span className="prog-circle done">
            <Check/>
          </span>
          <span className="prog-text">Cart</span>
        </a>

        <div className="prog-sep" />

        {/* Step 2 */}
        <div className="prog-step active">
          <span className="prog-circle active">2</span>
          <span className="prog-text">Checkout</span>
        </div>

        <div className="prog-sep" />

        {/* Step 3 */}
        <div className="prog-step inactive">
          <span className="prog-circle">3</span>
          <span className="prog-text">Confirmation</span>
        </div>

      </div>
    </div>
  );
};

export default ProgressStrip;