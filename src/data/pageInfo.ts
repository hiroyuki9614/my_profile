const rootPath = import.meta.env.PUBLIC_ROOT_PATH;
type PageMeta = {
	root?: string;
	metaTitle?: string;
	metaDescription?: string;
	headingTitle?: string;
	headingDescription?: string;
};
export type NavigationItem = {
	label?: string;
	path?: string;
};

export type PageInfo = {
	root?: string;
	post?: PageMeta;
	portfolio?: PageMeta;
	profile?: PageMeta;
	notFound?: PageMeta;
	internalServerError?: PageMeta;
	navigation?: NavigationItem[];
};

export const pageInfo: PageInfo = {
	root: rootPath,
	post: {
		metaTitle: '投稿一覧',
		metaDescription: 'hiroyuki9614のブログ記事一覧ページです。　日記や知識、仕事の内容などを投稿しています。',
		headingTitle: 'blog',
	},
	portfolio: {
		metaTitle: 'ポートフォリオ紹介',
		metaDescription: 'hiroyuki9614のポートフォリオページです。 これまでに制作したアプリケーションを紹介しています。',
		headingTitle: 'portfolio',
		headingDescription: 'これまでに制作したアプリケーションを紹介しています。',
	},
	profile: {
		metaTitle: 'プロフィール',
		metaDescription: 'hiroyuki9614のプロフィールページです。 経歴やスキル、趣味などを紹介しています。',
		headingTitle: 'profile',
	},
	notFound: {
		metaTitle: 'ページが見つかりません',
		metaDescription: 'お探しのページは見つかりませんでした。URLが正しいかどうかご確認ください。',
		headingTitle: '404 Not Found',
		headingDescription: 'お探しのページは見つかりませんでした。URLが正しいかどうかご確認ください。',
	},
	internalServerError: {
		metaTitle: 'サーバーエラー',
		metaDescription: 'サーバーでエラーが発生しました。しばらくしてから再度アクセスしてください。',
		headingTitle: '500 Internal Server Error',
		headingDescription: 'サーバーでエラーが発生しました。しばらくしてから再度アクセスしてください。',
	},
	navigation: [
		{ label: 'blog', path: `${rootPath}/posts` },
		{ label: 'portfolio', path: `${rootPath}/portfolio/` },
		{ label: 'profile', path: `${rootPath}/` },
	],
} as const;
