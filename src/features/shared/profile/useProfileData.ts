'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export function useProfileData() {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    user_id: '',
    email: '',
    phone: '',
    name: '',
    nickname: '',
    cohort: '',
    role: '',
    status: '',
  });

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (!p) return;
        setFormData({
          user_id: p.user_id || '',
          email: p.email || user.email || '',
          phone: p.phone || '', 
          name: p.name || '',
          nickname: p.nickname || '',
          cohort: p.cohort || 0,
          role: p.role === 'admin' ? '관리자' : '수강생',
          status: p.status || '',
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return { isLoading, formData, setFormData: (f: string, v: string) => setFormData((p) => ({ ...p, [f]: v })) };
}
