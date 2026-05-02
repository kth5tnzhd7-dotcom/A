"use client";

import { useState } from 'react';
import { Bot, Send, ToggleLeft, ToggleRight, Plus, ExternalLink, Trash2, Check, Globe } from 'lucide-react';

export interface Command {
  command: string;
  description: string;
  response: string;
  isActive: boolean;
}

export interface TelegramBotProps {
  onCreateBot?: (botData: any) => void;
  onSendMessage?: (botId: string, message: string) => void;
}

export function TelegramBot({ onCreateBot, onSendMessage }: TelegramBotProps) {
  const [activeTab, setActiveTab] = useState('create');
  const [botName, setBotName] = useState('');
  const [botUsername, setBotUsername] = useState('');
  const [token, setToken] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [bots, setBots] = useState<any[]>([]);
  const [commands, setCommands] = useState<Command[]>([]);
  const [newCommand, setNewCommand] = useState<Command>({
    command: '',
    description: '',
    response: '',
    isActive: true,
  });
  const [selectedBot, setSelectedBot] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ from: string; text: string; time: string }[]>([]);

  const handleCreateBot = async () => {
    setIsCreating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newBot = {
        id: Date.now(),
        name: botName,
        botUsername,
        token: token.slice(0, 10) + '...' + token.slice(-10),
        customDomain,
        isActive: true,
        messagesSent: 0,
        createdAt: new Date().toISOString(),
      };
      setBots([...bots, newBot]);
      setBotName('');
      setBotUsername('');
      setToken('');
      setCustomDomain('');
      onCreateBot?.(newBot);
    } catch (error) {
      console.error('Failed to create bot:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const toggleBotStatus = (botId: number) => {
    setBots(bots.map(bot =>
      bot.id === botId ? { ...bot, isActive: !bot.isActive } : bot
    ));
  };

  const addCommand = () => {
    if (!newCommand.command || !newCommand.response) return;
    setCommands([...commands, { ...newCommand, isActive: true }]);
    setNewCommand({ command: '', description: '', response: '', isActive: true });
  };

  const removeCommand = (index: number) => {
    setCommands(commands.filter((_, i) => i !== index));
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedBot) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString();

    // Add user message
    setChatHistory(prev => [...prev, { from: 'You', text: message, time: timeStr }]);
    setMessage('');

    // Simulate bot response
    setTimeout(() => {
      const response = commands.find((cmd: Command) =>
        message.toLowerCase().includes(cmd.command.toLowerCase())
      )?.response || '🤖 I received your message!';

      setChatHistory(prev => [...prev, {
        from: selectedBot.name,
        text: response,
        time: new Date().toLocaleTimeString(),
      }]);
    }, 1000);
  };

  if (activeTab === 'manage') {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Manage Bots</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {bots.length === 0 ? (
            <div className="bg-gray-700/50 rounded-lg p-8 text-center">
              <Bot className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No bots created yet</p>
              <button
                onClick={() => setActiveTab('create')}
                className="text-blue-400 hover:text-blue-300 mt-2"
              >
                Create your first bot
              </button>
            </div>
          ) : (
            bots.map((bot) => (
              <div key={bot.id} className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Bot className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{bot.name}</h3>
                      <p className="text-sm text-gray-400">@{bot.botUsername}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleBotStatus(bot.id)}
                    className="p-2 rounded-lg transition-colors"
                    style={{
                      backgroundColor: bot.isActive ? 'rgba(34, 211, 238, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                      color: bot.isActive ? '#22d3ee' : '#6b7280',
                    }}
                  >
                    {bot.isActive ? (
                      <ToggleRight className="w-5 h-5" />
                    ) : (
                      <ToggleLeft className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="text-sm text-gray-400 space-y-1 mb-4">
                  <div className="flex items-center gap-2">
                    <span>Token:</span>
                    <code className="text-gray-300 bg-gray-800 px-2 py-1 rounded">{bot.token}</code>
                  </div>
                  {bot.customDomain && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>{bot.customDomain}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    <span>{bot.messagesSent} messages sent</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedBot(bot)}
                    className="flex-1 border border-gray-600 text-gray-300 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                  >
                    Configure
                  </button>
                  <button className="bg-purple-500/20 text-purple-400 px-3 py-1.5 rounded-lg text-sm hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-1">
                    <ExternalLink className="w-4 h-4" />
                    Visit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (selectedBot && activeTab === 'manage') {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setSelectedBot(null)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back
          </button>
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Configure {selectedBot.name}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-gray-200 mb-3">Chat with Bot</h3>
              <div className="h-64 overflow-y-auto border border-gray-600 rounded-lg p-3 mb-3 space-y-3">
                {chatHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Send a message to start chatting...</p>
                ) : (
                  chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.from === 'You' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xs rounded-lg px-3 py-2 ${msg.from === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'}`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <span className="text-xs opacity-70">{msg.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            <h3 className="font-medium text-gray-200 mb-3">Commands</h3>
            <div className="space-y-2">
              {commands.length === 0 ? (
                <p className="text-gray-500 text-center py-4 bg-gray-700/50 rounded-lg">No commands added yet</p>
              ) : (
                commands.map((cmd, idx) => (
                  <div key={idx} className="bg-gray-700/50 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <span className="text-blue-400 font-mono">/{cmd.command}</span>
                      <p className="text-sm text-gray-400">{cmd.description}</p>
                    </div>
                    <button
                      onClick={() => removeCommand(idx)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-gray-200 mb-3">Add Command</h3>
              <input
                type="text"
                value={newCommand.command}
                onChange={(e) => setNewCommand({ ...newCommand, command: e.target.value })}
                placeholder="/command"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 mb-2 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={newCommand.description}
                onChange={(e) => setNewCommand({ ...newCommand, description: e.target.value })}
                placeholder="Description"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 mb-2 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={newCommand.response}
                onChange={(e) => setNewCommand({ ...newCommand, response: e.target.value })}
                placeholder="Response"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 mb-2 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={addCommand}
                disabled={!newCommand.command || !newCommand.response}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4">
              <h3 className="font-medium text-gray-200 mb-3">Custom Domain</h3>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="bot.example.com"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Telegram Bot</h2>
        </div>
        <div className="flex bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'create' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Create
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'manage' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Manage
          </button>
        </div>
      </div>

      {activeTab === 'create' && (
        <div className="max-w-2xl">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bot Name
            </label>
            <input
              type="text"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="My Awesome Bot"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bot Username
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">@</span>
              <input
                type="text"
                value={botUsername}
                onChange={(e) => setBotUsername(e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                placeholder="my_awesome_bot"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bot Token
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Custom Domain (Optional)
            </label>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                placeholder="bot.example.com"
              />
            </div>
          </div>

          <button
            onClick={handleCreateBot}
            disabled={isCreating || !botName || !botUsername || !token}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isCreating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Create Bot
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
