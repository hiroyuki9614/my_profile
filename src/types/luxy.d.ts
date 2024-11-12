declare module 'luxy.js' {
	interface LuxyOptions {
		wrapper?: string;
		targets?: string;
		wrapperSpeed?: number;
		targetSpeed?: number;
		targetPercentage?: number;
	}

	interface Luxy {
		init(options?: LuxyOptions): void;
	}

	const luxy: Luxy;
	export default luxy;
}
