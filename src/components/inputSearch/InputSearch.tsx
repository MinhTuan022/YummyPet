import React, { useState, useEffect } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

type InputSearchProps = {
  placeholder?: string;
  delay?: number;
  onSearch: (value: string) => void;
  disabled?: boolean;
};

const InputSearch: React.FC<InputSearchProps> = ({
  placeholder = "Tìm kiếm...",
  delay = 300,
  onSearch,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(inputValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delay, onSearch]);

  return (
    <Input
      placeholder={placeholder}
      prefix={<SearchOutlined />}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      allowClear
      disabled={disabled}
    />
  );
};

export default InputSearch;
