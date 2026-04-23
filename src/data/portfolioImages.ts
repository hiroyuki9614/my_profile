import blogImage from '@/images/portfolio/blog.png';
import oddtrackImage from '@/images/portfolio/oddtrack.png';
import type { ImageMetadata } from 'astro';
import blogSlideImage1 from '@/images/slides/blog/blog1.png';
import blogSlideImage2 from '@/images/slides/blog/blog2.png';
import blogSlideImage3 from '@/images/slides/blog/blog3.png';
import oddTrackSlideImage1 from '@/images/slides/oddTrack/oddTrack1.png';
import oddTrackSlideImage2 from '@/images/slides/oddTrack/oddTrack2.png';
import oddTrackSlideImage3 from '@/images/slides/oddTrack/oddTrack3.png';

type PortfolioImage = {
	url?: string;
	displayImage?: ImageMetadata;
	displayImageAlt?: string;
	title: string;
	description?: string;
	tech?: string;
	tags?: string[];
	githubLink?: string;
	slideImages?: ImageMetadata[];
};

const portfolioImages: Record<string, PortfolioImage> = {
	my_profile: {
		url: 'https://hiroyuki9614.github.io/my_profile/',
		displayImage: blogImage,
		displayImageAlt: 'ブログサイトのスクリーンショット',
		title: 'ブログサイト',
		description: 'このホームページです。 GitHub Pagesにデプロイしています。',
		tech: 'Astro, TypeScript',
		tags: ['astro'],
		githubLink: 'https://github.com/hiroyuki9614/my_profile',
		slideImages: [blogSlideImage1, blogSlideImage2, blogSlideImage3],
	},
	oddtrack: {
		url: '',
		displayImage: oddtrackImage,
		displayImageAlt: '走行距離管理アプリのスクリーンショット',
		title: '走行距離管理アプリ',
		slideImages: [oddTrackSlideImage1, oddTrackSlideImage2, oddTrackSlideImage3],
		tech: 'Ruby on Rails, Vue.js',
		description: '走行距離を管理するアプリです。 走行距離を入力すると、月ごとの走行距離や、車ごとの走行距離をグラフで表示します。',
		tags: [],
		githubLink: 'https://github.com/hiroyuki9614/odo_track',
	},
	bookLibrary: {
		url: '',
		displayImage: undefined,
		displayImageAlt: undefined,
		slideImages: [],
		title: '書籍閲覧アプリ',
		tech: 'React + Vite, Hono',
		description: 'WEB上で書籍を閲覧できるアプリです。現在開発中です。',
		tags: ['bookLibrary'],
		githubLink: 'https://github.com/hiroyuki9614/book_library',
	},
};

export default portfolioImages;
