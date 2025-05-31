import { Input } from "@/components/ui/input";
import { useState } from "react";

type FilterBarProps = {
  onSearch: (term: string) => void;
};

export default function FilterBar({ onSearch }: FilterBarProps) {
  const [value, setValue] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onSearch(e.target.value);
    setValue(e.target.value);
  }

  return (
    <Input
      type="text"
      placeholder="Pesquisar"
      className="w-48"
      value={value}
      onChange={handleChange}
    />
  );
}
