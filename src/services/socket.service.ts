import { io, Socket } from 'socket.io-client';
import type { Song } from '../types/song.types';

export interface SongState {
  id: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  volume: number;
  updatedAt?: number;
}

export interface SongStateRetrieval extends SongState {
  song: Song;
}

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(authToken?: string) {
    if (this.socket) return;

    const serverUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8081';
    
    this.socket = io(serverUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      auth: {
        token: `Bearer ${authToken}`,
      }
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('[SOCKET] Connected to server');
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('[SOCKET] Disconnected from server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('[SOCKET] Connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Song state synchronization
  onSongStateConnected(callback: (state: SongStateRetrieval | null) => void) {
    this.socket?.on('song-state:connected', callback);
  }

  updateSongState(state: SongState) {
    if (this.isConnected && this.socket) {
      this.socket.emit('song-state:update', state);
    }
  }

  clearSongState() {
    if (this.isConnected && this.socket) {
      this.socket.emit('song-state:clear');
    }
  }

  onSongStateError(callback: (error: string) => void) {
    this.socket?.on('song-state:error', callback);
  }

  onSongStateCleared(callback: () => void) {
    this.socket?.on('song-state:cleared', callback);
  }

  // Group room functionality
  joinRoom(roomId: string) {
    if (this.isConnected && this.socket) {
      this.socket.emit('group-room:join', roomId);
    }
  }

  leaveRoom(roomId: string) {
    if (this.isConnected && this.socket) {
      this.socket.emit('group-room:leave', roomId);
    }
  }

  // Notifications
  onNotification(callback: (notification: any) => void) {
    this.socket?.on('notification', callback);
  }

  getConnectionStatus() {
    return this.isConnected;
  }

  // Cleanup
  removeAllListeners() {
    this.socket?.removeAllListeners();
  }
}

export const socketService = new SocketService();