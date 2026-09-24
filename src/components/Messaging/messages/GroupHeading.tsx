// messages/GroupHeading.tsx
import React from 'react';
import './styles/GroupHeading.css';

interface GroupHeadingProps {
  label: string;
}

export const GroupHeading: React.FC<GroupHeadingProps> = ({ label }) => {
  const displayLabel = label.replace(/\s*-\s*/g, ' · ').toUpperCase();
  return (
    <tr className="msg-group-heading">
      <td colSpan={6}>{displayLabel}</td>
    </tr>
  );
};