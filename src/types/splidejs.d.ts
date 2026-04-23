declare module '@splidejs/react-splide' {
	import * as React from 'react';
	import type { Options } from '@splidejs/splide';

	export interface SplideProps extends React.HTMLAttributes<HTMLDivElement> {
		options?: Options;
		hasTrack?: boolean;
		tag?: string;
		extensions?: Record<string, unknown>;
		className?: string;
		children?: React.ReactNode;
	}
	export const Splide: React.FC<SplideProps>;

	export interface SplideSlideProps extends React.LiHTMLAttributes<HTMLLIElement> {
		isClone?: boolean;
		className?: string;
		children?: React.ReactNode;
	}
	export const SplideSlide: React.FC<SplideSlideProps>;
}
