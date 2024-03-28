import './Card.css';
import React from 'react';

interface ColumnProps {
  children: React.ReactNode;
}

const Column: React.FC<ColumnProps> = ({ children }) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <div className="column-container">
      {childrenArray.map((child, index) => (
        <div key={index} className="column">
          {child}
        </div>
      ))}
    </div>
  );
};

export default Column;