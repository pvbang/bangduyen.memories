/**
 * TypeScript interfaces cho Memory data
 * Dựa trên cấu trúc từ data/memories.json
 */

export type MemoryCategory = 'milestone' | 'dating' | 'daily' | 'quotes';

export interface Memory {
  id: number;
  title: string;
  date: string; // "YYYY-MM-DD" format
  category: MemoryCategory;
  content: string;
  mood: string;
  template: string;
  showImages: boolean;
  images: string[];
}

export interface CategoryInfo {
  name: string;
  icon: string;
  description: string;
}

export interface MemoriesData {
  memories: Memory[];
  categories: Record<MemoryCategory, CategoryInfo>;
}
