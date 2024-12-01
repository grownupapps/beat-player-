import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const BeatUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bpm: '',
    key: '',
    productUrl: '',
    beat: null,
    cover: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await fetch('http://localhost:5000/api/beats', {
        method: 'POST',
        body: formDataToSend
      });
      
      if (response.ok) {
        setFormData({
          title: '',
          description: '',
          bpm: '',
          key: '',
          productUrl: '',
          beat: null,
          cover: null
        });
        // Optional: Callback zur Dashboard-Komponente um die Liste zu aktualisieren
        // onUploadSuccess && onUploadSuccess();
      }
    } catch (error) {
      console.error('Error submitting beat:', error);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Upload New Beat</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Title</label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label className="block mb-2">Description</label>
          <Input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">BPM</label>
            <Input
              type="number"
              name="bpm"
              value={formData.bpm}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block mb-2">Key</label>
            <Input
              type="text"
              name="key"
              value={formData.key}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-2">Product URL</label>
          <Input
            type="url"
            name="productUrl"
            value={formData.productUrl}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Beat File</label>
            <Input
              type="file"
              name="beat"
              onChange={handleFileChange}
              accept="audio/*"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Cover Image</label>
            <Input
              type="file"
              name="cover"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Upload Beat
        </Button>
      </form>
    </Card>
  );
};

export default BeatUpload;