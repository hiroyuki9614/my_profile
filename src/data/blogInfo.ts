import work from '@/images/thumbnails/work.webp';
import knowledge from '@/images/thumbnails/knowledge.webp';
import note from '@/images/thumbnails/note.webp';
import diary from '@/images/thumbnails/diary.webp';
import type { ImageMetadata } from 'astro';

export type Category = '日記' | 'メモ' | '知識' | '仕事';

const fontColor = 'text-gray-800';

export const blogInfo = {
	fontColor,
	categoryColor: {
		日記: `bg-purple-200 ${fontColor}`,
		メモ: `bg-blue-200 ${fontColor}`,
		知識: `bg-green-200 ${fontColor}`,
		仕事: `bg-orange-200 ${fontColor}`,
	},
	categoryDefaultImage: {
		日記: [diary, '日記のサムネイル'],
		メモ: [note, 'メモのサムネイル'],
		知識: [knowledge, '知識のサムネイル'],
		仕事: [work, '仕事のサムネイル'],
	},
} satisfies {
	fontColor: string;
	categoryColor: Record<Category, string>;
	categoryDefaultImage: Record<Category, [ImageMetadata, string]>;
};
