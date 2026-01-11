'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import type { PortfolioMode } from '@/types/portfolio';

interface ModeSwitcherProps {
  currentMode: PortfolioMode;
  onModeChange: (mode: PortfolioMode) => void;
}

const modes = [
  { value: 'full', label: 'Full Portfolio', description: 'Tampilkan semua data' },
  { value: 'teacher', label: 'Teacher Mode', description: 'Pengalaman mengajar saja' },
  { value: 'developer', label: 'Developer Mode', description: 'Pengalaman development' },
  { value: 'researcher', label: 'Researcher Mode', description: 'Riset dan publikasi' },
];

export function ModeSwitcher({ currentMode, onModeChange }: ModeSwitcherProps) {
  return (
    <Card className="p-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Portfolio Mode</label>
        <Select value={currentMode} onValueChange={(value) => onModeChange(value as PortfolioMode)}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih mode" />
          </SelectTrigger>
          <SelectContent>
            {modes.map((mode) => (
              <SelectItem key={mode.value} value={mode.value}>
                <div>
                  <div className="font-medium">{mode.label}</div>
                  <div className="text-xs text-muted-foreground">{mode.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
