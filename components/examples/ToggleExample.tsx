import { Toggle } from '@/components';
import { useState } from 'react';

export default function ToggleExample() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <Toggle isOn={isEnabled} onToggle={() => setIsEnabled((prev) => !prev)} />
  );
}
