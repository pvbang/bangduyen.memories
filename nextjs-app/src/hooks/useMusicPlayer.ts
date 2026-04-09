'use client';

/**
 * Hook quản lý Music Player
 * Chuyển đổi từ IIFE music player trong memories.js
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { PLAYLIST } from '@/lib/constants';
import { wrapIndex } from '@/lib/utils';

export function useMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentTrack = PLAYLIST[currentIndex];

  /**
   * Load bài hát theo index
   */
  const loadTrack = useCallback(
    (index: number) => {
      const newIndex = wrapIndex(index, PLAYLIST.length);
      setCurrentIndex(newIndex);

      if (audioRef.current) {
        const wasPlaying = !audioRef.current.paused;
        audioRef.current.src = PLAYLIST[newIndex].src;

        if (wasPlaying) {
          audioRef.current.play().catch(() => {
            // Browser có thể block autoplay
            setIsPlaying(false);
          });
        }
      }
    },
    []
  );

  /**
   * Toggle play/pause
   */
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  /**
   * Bài trước
   */
  const prevTrack = useCallback(() => {
    loadTrack(currentIndex - 1);
  }, [currentIndex, loadTrack]);

  /**
   * Bài sau
   */
  const nextTrack = useCallback(() => {
    loadTrack(currentIndex + 1);
  }, [currentIndex, loadTrack]);

  /**
   * Sync playing state khi audio events thay đổi
   */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      // Auto next khi hết bài
      loadTrack(currentIndex + 1);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, loadTrack]);

  return {
    audioRef,
    currentTrack,
    isPlaying,
    togglePlay,
    prevTrack,
    nextTrack,
  };
}
