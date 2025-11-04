import { useState, useEffect } from 'react';
import { CompleteFormData } from '@/lib/form-schema';

export function useFormPreview() {
  const [formData, setFormData] = useState<Partial<CompleteFormData>>({});
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);

  useEffect(() => {
    // Load from localStorage if exists
    const savedData = localStorage.getItem('form-draft');
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error('Failed to load form draft:', error);
      }
    }
  }, []);

  const updateFormData = (section: keyof CompleteFormData, data: any) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [section]: data,
      };
      // Save to localStorage
      localStorage.setItem('form-draft', JSON.stringify(updated));
      return updated;
    });
  };

  const clearFormData = () => {
    setFormData({});
    localStorage.removeItem('form-draft');
  };

  const togglePreview = () => {
    setIsPreviewVisible((prev) => !prev);
  };

  return {
    formData,
    updateFormData,
    clearFormData,
    isPreviewVisible,
    togglePreview,
  };
}

