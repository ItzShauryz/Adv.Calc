import React, { useState, useEffect } from 'react';
import { SecretPhoto } from '../types';
import { Camera, Plus, Trash2, X, Eye } from 'lucide-react';

export default function PhotosApp() {
  const [photos, setPhotos] = useState<SecretPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<SecretPhoto | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [fileBase64, setFileBase64] = useState('');
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('adv_calc_vault_photos');
    if (raw) {
      try {
        setPhotos(JSON.parse(raw));
      } catch (e) {
        // empty
      }
    } else {
      // Setup some default high-quality illustrative mock vault images
      const defaults: SecretPhoto[] = [
        {
          id: 'p1',
          url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=640&q=80',
          caption: 'Project Blueprint Alpha Vector',
          date: '2026-06-21'
        },
        {
          id: 'p2',
          url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=640&q=80',
          caption: 'Encrypted Terminal logs visualizer',
          date: '2026-06-22'
        }
      ];
      setPhotos(defaults);
      localStorage.setItem('adv_calc_vault_photos', JSON.stringify(defaults));
    }
  }, []);

  const saveToStorage = (updatedList: SecretPhoto[]) => {
    setPhotos(updatedList);
    localStorage.setItem('adv_calc_vault_photos', JSON.stringify(updatedList));
  };

  const processFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFileBase64(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSavePhoto = () => {
    if (!fileBase64) return;
    const newPhoto: SecretPhoto = {
      id: Date.now().toString(),
      url: fileBase64,
      caption: caption || 'Crypt-Photo',
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [newPhoto, ...photos];
    saveToStorage(updated);
    setIsUploading(false);
    setFileBase64('');
    setCaption('');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm && !window.confirm('Delete this encrypted photo?')) return;
    const updated = photos.filter(p => p.id !== id);
    saveToStorage(updated);
    if (selectedPhoto?.id === id) {
      setSelectedPhoto(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 font-sans select-none">
      {/* App Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-850 bg-zinc-900">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-base tracking-tight">Secret Photo Vault</span>
        </div>
        {isUploading ? (
          <button
            onClick={() => { setIsUploading(false); setFileBase64(''); }}
            className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded"
          >
            Cancel
          </button>
        ) : (
          <button
            onClick={() => setIsUploading(true)}
            className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Photo
          </button>
        )}
      </div>

      {isUploading ? (
        <div className="flex-1 p-4 bg-zinc-950 overflow-y-auto space-y-4 flex flex-col justify-between">
          <div className="space-y-4 flex-1">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider font-mono">Upload encrypted media</h3>
            
            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all ${
                dragActive ? 'border-emerald-500 bg-emerald-950/10' : 'border-zinc-800 bg-zinc-900/40'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="photo-file-picker"
              />
              {fileBase64 ? (
                <div className="relative max-w-full">
                  <img
                    src={fileBase64}
                    alt="preview"
                    className="max-h-40 rounded-lg mx-auto object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <p className="text-[10px] text-emerald-400 font-mono mt-2">✓ Image loaded successfully</p>
                </div>
              ) : (
                <label htmlFor="photo-file-picker" className="cursor-pointer space-y-2">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mx-auto hover:bg-zinc-700 transition-all">
                    <Plus className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-zinc-300">Choose a photo</span>
                    <p className="text-xs text-zinc-500 mt-1">or drag & drop your private image file here</p>
                  </div>
                </label>
              )}
            </div>

            {/* Title / Description */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Caption / File Memo</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. Secret Banking coordinates"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            onClick={handleSavePhoto}
            disabled={!fileBase64}
            className={`w-full py-2.5 rounded-xl font-bold transition-all text-center text-sm ${
              fileBase64
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-lg'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
            }`}
          >
            Encrypt & Save to Local Sandbox
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4">
          {photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-zinc-500 text-center px-4">
              <Camera className="w-12 h-12 stroke-1 mb-2 text-zinc-600" />
              <p className="text-sm font-semibold">Vault is Empty</p>
              <p className="text-xs text-zinc-650 mt-1">Files decrypted in this session are saved directly inside your browser cache.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3" id="photo-v-grid">
              {photos.map(photo => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative aspect-square bg-zinc-900 border border-zinc-850 rounded-xl overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-all"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end">
                    <p className="text-xs font-bold text-white truncate">{photo.caption}</p>
                    <div className="flex justify-between items-center mt-1.5 pt-1 border-t border-white/10">
                      <span className="text-[9px] text-zinc-400">{photo.date}</span>
                      <button
                        onClick={(e) => handleDelete(photo.id, e)}
                        className="hover:text-red-400 p-0.5 rounded text-white"
                        title="Delete Secure Photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Full Screen View Modal */}
      {selectedPhoto && (
        <div className="absolute inset-0 bg-black/95 z-50 flex flex-col justify-between p-4 font-sans animate-fade-in">
          <div className="flex items-center justify-between text-white">
            <span className="text-xs font-mono text-zinc-400">{selectedPhoto.date}</span>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="p-1.5 rounded-full bg-zinc-900 text-white hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-2">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption}
              className="max-h-[70vh] max-w-full rounded-lg shadow-2xl object-contain border border-zinc-900"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl text-center">
            <p className="text-sm font-bold text-emerald-400 mb-1">{selectedPhoto.caption}</p>
            <p className="text-xs text-zinc-400">Classified Media. Local Node Sandbox Decrypted Viewport.</p>
          </div>
        </div>
      )}
    </div>
  );
}
