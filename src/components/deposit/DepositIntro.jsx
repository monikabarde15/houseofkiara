import React from 'react';

const DepositIntro = ({ getVal }) => {
  const customBody = getVal ? getVal("opening_body", null) : null;
  if (customBody) {
    return <p className="dp-intro">{customBody}</p>;
  }

  return (
    <p className="dp-intro">
      Every piece at House of Kaira carries a story, often one its owner holds dear. Your refundable security deposit keeps that story safe for the next person who wears it. It remains yours throughout: when your piece returns on time and as it left us, <strong>every rupee is returned to you.</strong>
    </p>
  );
};

export default React.memo(DepositIntro);
