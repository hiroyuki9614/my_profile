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
		url: 'https://hiroyuki9614.com/',
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
		url: 'https://odt.hiroyuki9614.com/',
		displayImage: oddtrackImage,
		displayImageAlt: '走行距離管理アプリのスクリーンショット',
		title: 'ODO TRACK（運転日報・走行距離管理）',
		slideImages: [oddTrackSlideImage1, oddTrackSlideImage2, oddTrackSlideImage3],
		tech: 'Ruby on Rails, Vue.js, PostgreSQL, Docker Compose, Nginx',
		description:
			'車両ごとの運転日報と走行距離を管理するWebアプリです。一般・管理者権限、日報CRUD、車両管理、お気に入り、PDF出力に対応し、VPS上でDocker Compose運用しています。',
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
