declare module 'bubbly-bg' {
	interface BubblyOptions {
		canvas?: HTMLCanvasElement;
		blur?: number;
		colorStart?: string;
		colorStop?: string;
		radiusFunc?: () => number;
		angleFunc?: () => number;
		velocityFunc?: () => number;
		bubbleFunc?: () => number;
		compose?: string;
	}

	function bubbly(options?: BubblyOptions): void;
	export default bubbly;
}
