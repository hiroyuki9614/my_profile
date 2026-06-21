const rootPath = '/hiroyuki9614.com/';

export type PageMeta = {
	root?: string;
	metaTitle: string;
	metaDescription: string;
	headingTitle: string;
	headingDescription?: string;
	type: 'website' | 'article' | 'profile';
};
export type NavigationItem = {
	label: string;
	path: string;
};

export type PageInfo = {
	root: string;
	post: PageMeta;
	portfolio: PageMeta;
	profile: PageMeta;
	notFound: PageMeta;
	internalServerError: PageMeta;
	navigation: NavigationItem[];
};

export const pageInfo: PageInfo = {
	root: rootPath,
	post: {
		metaTitle: '投稿一覧',
		metaDescription: 'hiroyuki9614のブログ記事一覧ページです。　日記や知識、仕事の内容などを投稿しています。',
		headingTitle: 'blog',
		type: 'article',
	},
	portfolio: {
		metaTitle: 'ポートフォリオ紹介',
		metaDescription: 'hiroyuki9614のポートフォリオページです。 これまでに制作したアプリケーションを紹介しています。',
		headingTitle: 'portfolio',
		headingDescription: 'これまでに制作したアプリケーションを紹介しています。',
		type: 'website',
	},
	profile: {
		metaTitle: 'プロフィール',
		metaDescription: 'hiroyuki9614のプロフィールページです。 経歴やスキル、趣味などを紹介しています。',
		headingTitle: 'profile',
		type: 'profile',
	},
	notFound: {
		metaTitle: 'ページが見つかりません',
		metaDescription: 'お探しのページは見つかりませんでした。URLが正しいかどうかご確認ください。',
		headingTitle: '404 Not Found',
		headingDescription: 'お探しのページは見つかりませんでした。URLが正しいかどうかご確認ください。',
		type: 'website',
	},
	internalServerError: {
		metaTitle: 'サーバーエラー',
		metaDescription: 'サーバーでエラーが発生しました。しばらくしてから再度アクセスしてください。',
		headingTitle: '500 Internal Server Error',
		headingDescription: 'サーバーでエラーが発生しました。しばらくしてから再度アクセスしてください。',
		type: 'website',
	},
	navigation: [
		{ label: 'blog', path: `${rootPath}/posts` },
		{ label: 'portfolio', path: `${rootPath}/portfolio/` },
		{ label: 'profile', path: `${rootPath}/` },
	],
} as const;
