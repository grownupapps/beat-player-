import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Play, Pause } from 'lucide-react';

const AdminDashboard = () => {
  const [beats, setBeats] = useState([]);
  const [editingBeat, setEditingBeat] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bpm: '',
    key: '',
    productUrl: '',
    beat: null,
    cover: null
  });

  useEffect(() => {
    fetchBeats();
  }, []);

  const fetchBeats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/beats');
      const data = await response.json();
      setBeats(data);
    } catch (error) {
      console.error('Error fetching beats:', error);
    }
  };

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
      const url = editingBeat 
        ? `http://localhost:5000/api/beats/${editingBeat._id}`
        : 'http://localhost:5000/api/beats';
      
      const method = editingBeat ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
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
        setEditingBeat(null);
        fetchBeats();
      }
    } catch (error) {
      console.error('Error submitting beat:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/beats/${id}`, {
        method: 'DELETE'
      });
      fetchBeats();
    } catch (error) {
      console.error('Error deleting beat:', error);
    }
  };

  const handleEdit = (beat) => {
    setEditingBeat(beat);
    setFormData({
      title: beat.title,
      description: beat.description,
      bpm: beat.bpm,
      key: beat.key,
      productUrl: beat.productUrl,
      beat: null,
      cover: null
    });
  };

  const togglePlay = (beatUrl) => {
    if (currentAudio) {
      currentAudio.pause();
      if (currentAudio.src === beatUrl && isPlaying) {
        setIsPlaying(false);
        return;
      }
    }

    const audio = new Audio(beatUrl);
    audio.play();
    setCurrentAudio(audio);
    setIsPlaying(true);

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentAudio(null);
    };
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
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

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Uploaded Beats</h2>
        
        {beats.map(beat => (
          <Card key={beat._id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src={`http://localhost:5000/${beat.coverImage}`} 
                  alt={beat.title}
                  className="w-16 h-16 object-cover rounded"
                />
                
                <div>
                  <h3 className="font-bold">{beat.title}</h3>
                  <p className="text-sm text-gray-600">
                    BPM: {beat.bpm} | Key: {beat.key}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => togglePlay(`http://localhost:5000/${beat.beatFile}`)}
                >
                  {isPlaying && currentAudio?.src === `http://localhost:5000/${beat.beatFile}` 
                    ? <Pause className="h-4 w-4" />
                    : <Play className="h-4 w-4" />
                  }
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(beat)}
                >
                  <Edit className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(beat._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;