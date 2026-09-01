// setup/SetupTodoBar.tsx
import React from 'react';
import { Button } from '../components/Button';
import './styles/SetupTodoBar.css';

interface TodoItem {
  id: string;
  message: React.ReactNode;
  buttonLabel: string;
  onClick: () => void;
}

interface SetupTodoBarProps {
  items: TodoItem[];
}

export const SetupTodoBar: React.FC<SetupTodoBarProps> = ({ items }) => {
  if (items.length === 0) {
    return null;
  }

  const count = items.length;

  return (
    <div className="msg-todo-bar">
      <div className="msg-todo-bar-heading">
        {count} thing{count > 1 ? 's' : ''} to do
      </div>
      {items.map((item) => (
        <div key={item.id} className="msg-todo-row">
          <span className="msg-todo-row-text">{item.message}</span>
          <Button variant="secondary" size="small" onClick={item.onClick}>
            {item.buttonLabel}
          </Button>
        </div>
      ))}
    </div>
  );
};