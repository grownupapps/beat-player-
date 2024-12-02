import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Trash2, Edit, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BeatUpload from './BeatUpload';
import { fetchBeats, createBeat, updateBeat, deleteBeat } from '../services/adminAPI';

const Dashboard = () => {
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
    loadBeats();
  }, []);

  const loadBeats = async () => {
    try {
      const data = await fetchBeats();
      setBeats(data);
    } catch (error) {
      console.error('Error loading beats:', error);
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
      if (editingBeat) {
        await updateBeat(editingBeat._id, formDataToSend);
      } else {
        await createBeat(formDataToSend);
      }
      
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
      loadBeats();
    } catch (error) {
      console.error('Error submitting beat:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBeat(id);
      loadBeats();
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
      <BeatUpload 
        formData={formData}
        editingBeat={editingBeat}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
      />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Uploaded Beats</h2>
        {beats.map(beat => (
          <Card key={beat._id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src={`${process.env.REACT_APP_API_URL}/${beat.coverImage}`}
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
                  onClick={() => togglePlay(`${process.env.REACT_APP_API_URL}/${beat.beatFile}`)}
                >
                  {isPlaying && currentAudio?.src === `${process.env.REACT_APP_API_URL}/${beat.beatFile}` 
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

export default Dashboard;