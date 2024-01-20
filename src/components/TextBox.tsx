import React, { ChangeEvent, FC } from 'react';

interface TextBoxProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
}

const TextBox: FC<TextBoxProps> = ({ value, onChange, placeholder }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
};

export default TextBox;

