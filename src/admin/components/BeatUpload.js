import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const BeatUpload = ({ formData, editingBeat, handleInputChange, handleFileChange, handleSubmit }) => {
  return (
    <Card className="p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">
        {editingBeat ? 'Edit Beat' : 'Upload New Beat'}
      </h2>
      
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
              required={!editingBeat}
            />
          </div>

          <div>
            <label className="block mb-2">Cover Image</label>
            <Input
              type="file"
              name="cover"
              onChange={handleFileChange}
              accept="image/*"
              required={!editingBeat}
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          {editingBeat ? 'Update Beat' : 'Upload Beat'}
        </Button>
      </form>
    </Card>
  );
};

export default BeatUpload;