'use client';

import { useState } from 'react';
import { Button } from './index';
import { Save, Trash2, Plus, Search, Download, ChevronRight } from 'lucide-react';

export default function ButtonTest() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold">Button Component Test</h1>

      {/* Variants */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Variants</h2>
        <div className="flex gap-4 flex-wrap">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="gradient">Gradient</Button>
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Sizes</h2>
        <div className="flex gap-4 items-center flex-wrap">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
        </div>
      </div>

      {/* With Icons */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">With Icons</h2>
        <div className="flex gap-4 flex-wrap">
          <Button leftIcon={<Save size={18} />}>Save</Button>
          <Button variant="danger" leftIcon={<Trash2 size={18} />}>Delete</Button>
          <Button variant="secondary" rightIcon={<ChevronRight size={18} />}>Next</Button>
          <Button variant="outline" leftIcon={<Search size={18} />} rightIcon={<Download size={18} />}>
            Search & Export
          </Button>
        </div>
      </div>

      {/* Icon Only */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Icon Only Buttons</h2>
        <div className="flex gap-4 items-center flex-wrap">
          <Button size="sm" isIconOnly variant="ghost"><Plus size={16} /></Button>
          <Button size="md" isIconOnly variant="outline"><Search size={18} /></Button>
          <Button size="lg" isIconOnly variant="primary"><Save size={20} /></Button>
        </div>
      </div>

      {/* Loading State */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Loading State</h2>
        <div className="flex gap-4 flex-wrap">
          <Button onClick={handleClick} isLoading={isLoading}>
            Click to Load
          </Button>
          <Button variant="gradient" isLoading={true} loadingText="저장 중...">
            저장하기
          </Button>
          <Button variant="outline" isLoading={true} loadingText="처리 중..." size="lg">
            Submit
          </Button>
        </div>
      </div>

      {/* Full Width */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Full Width</h2>
        <div className="space-y-2 max-w-md">
          <Button fullWidth>회원가입</Button>
          <Button fullWidth variant="outline">로그인</Button>
        </div>
      </div>

      {/* Disabled State */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Disabled State</h2>
        <div className="flex gap-4 flex-wrap">
          <Button disabled>Disabled Primary</Button>
          <Button variant="secondary" disabled>Disabled Secondary</Button>
          <Button variant="outline" disabled leftIcon={<Save size={18} />}>
            Disabled with Icon
          </Button>
        </div>
      </div>
    </div>
  );
}