"use client";

import { useState } from 'react';
import { Upload, File, Globe, Check, Loader2, Trash2, ExternalLink } from 'lucide-react';
import { Recharts, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export interface FileInfo {
  path: string;
  size: number;
  type: string;
}

export interface WebsiteHostingProps {
  onDeploy?: (files: FileList) => void;
  onAddDomain?: (domain: string) => void;
}

export function WebsiteHosting({ onDeploy, onAddDomain }: WebsiteHostingProps) {
  const [activeTab, setActiveTab] = useState('deploy');
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const [bandwidthData] = useState([
    { name: 'Mon', views: 4000 },
    { name: 'Tue', views: 3000 },
    { name: 'Wed', views: 5000 },
    { name: 'Thu', views: 7000 },
    { name: 'Fri', views: 6000 },
    { name: 'Sat', views: 8000 },
    { name: 'Sun', views: 9000 },
  ]);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDeploy = async () => {
    setIsUploading(true);
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      const url = `https://${files[0]?.name?.split('.')[0] || 'site'}.siteservice.test`;
      setDeployedUrl(url);
      onDeploy?.(files);
    } catch (error) {
      console.error('Deployment failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddDomain = async () => {
    if (!customDomain.trim()) return;
    setIsAddingDomain(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onAddDomain?.(customDomain);
      setCustomDomain('');
    } finally {
      setIsAddingDomain(false);
    }
  };

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  if (activeTab === 'statistics') {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Site Statistics</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Total Views</div>
            <div className="text-2xl font-bold text-white">24.5K</div>
            <div className="text-sm text-green-400">+12% from last week</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Bandwidth Used</div>
            <div className="text-2xl font-bold text-white">1.2GB</div>
            <div className="text-sm text-gray-400">of 10GB limit</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Storage Used</div>
            <div className="text-2xl font-bold text-white">45MB</div>
            <div className="text-sm text-gray-400">of 500MB limit</div>
          </div>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-200 mb-4">Weekly Views</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bandwidthData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
                <XAxis dataKey="name" stroke="#9ca3af"/>
                <YAxis stroke="#9ca3af"/>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#22d3ee"
                  fill="url(#colorViews)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Website Hosting</h2>
        </div>
        <div className="flex bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('deploy')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'deploy' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Deploy
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'statistics' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Stats
          </button>
        </div>
      </div>

      {deployedUrl && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-400" />
            <span className="text-green-400">Site deployed successfully!</span>
          </div>
          <div className="flex items-center gap-2">
            <code className="text-sm text-green-400 bg-green-500/10 px-2 py-1 rounded">
              {deployedUrl}
            </code>
            <a
              href={deployedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div
            onDrop={handleFileDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-gray-500 transition-colors"
          >
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload-site"
            />
            <label
              htmlFor="file-upload-site"
              className="cursor-pointer flex flex-col items-center gap-4"
            >
              <Upload className="w-10 h-10 text-gray-400" />
              <div>
                <p className="text-gray-300 font-medium">Drop files here or click to upload</p>
                <p className="text-sm text-gray-500 mt-1">HTML, CSS, JS, and static assets</p>
              </div>
            </label>
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-300">Files to deploy</span>
                <span className="text-sm text-gray-400">{formatFileSize(totalSize)}</span>
              </div>
              <div className="max-h-48 overflow-y-auto border border-gray-700 rounded-lg">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <File className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-white">{file.name}</div>
                        <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleDeploy}
            disabled={files.length === 0 || isUploading}
            className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Deploying...
              </>
            ) : (
              <>
                <Globe className="w-5 h-5" />
                Deploy Site
              </>
            )}
          </button>
        </div>

        <div>
          <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-gray-200 mb-3">Custom Domain</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="example.com"
                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleAddDomain}
                disabled={isAddingDomain || !customDomain.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="font-medium text-gray-200 mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Storage</span>
                <span className="text-white">45MB / 500MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Bandwidth</span>
                <span className="text-white">1.2GB / 10GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Domains</span>
                <span className="text-white">1 / 5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className="text-green-400">Active</span>
              </div>
            </div>
            <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '9%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
