'use client';

/**
 * Music Player Component
 * Floating music player cố định ở góc phải dưới
 * Chuyển đổi từ .music-box trong memories.html
 */

import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import { cn } from '@/lib/utils';
import styles from './MusicPlayer.module.css';

export function MusicPlayer() {
  const {
    audioRef,
    currentTrack,
    isPlaying,
    togglePlay,
    prevTrack,
    nextTrack,
  } = useMusicPlayer();

  return (
    <div className={styles.musicBox}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} loop src={currentTrack.src} />

      <button
        className={styles.musicPrev}
        onClick={prevTrack}
        title="Bài trước"
        aria-label="Bài trước"
      >
        <i className="fas fa-step-backward" />
      </button>

      <button
        className={cn(styles.musicBtn, isPlaying && styles.playing)}
        onClick={togglePlay}
        title="Phát / Dừng"
        aria-label={isPlaying ? 'Dừng nhạc' : 'Phát nhạc'}
      >
        <i className={`fas fa-${isPlaying ? 'pause' : 'music'}`} />
      </button>

      <button
        className={styles.musicNext}
        onClick={nextTrack}
        title="Bài sau"
        aria-label="Bài sau"
      >
        <i className="fas fa-step-forward" />
      </button>

      <div className={styles.musicName}>{currentTrack.name}</div>
    </div>
  );
}
