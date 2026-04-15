// 日付をyyyy/mm/ddの形式でフォーマットする関数
export const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}年${month}月${day}日`;
};
