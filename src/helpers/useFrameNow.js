import { useState, useEffect } from "react";

function useFrameNow(isActive) {
	const [now, setNow] = useState(null);

	useEffect(() => {
		if (!isActive) return;

		let id;

		function updateNow() {
			setNow(performance.now());
		}

		function tick() {
			if (!isActive) return;
			updateNow();
			id = requestAnimationFrame(tick);
		}

		updateNow();
		id = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(id);
	}, [isActive]);

	return isActive ? now : null;
}

export default useFrameNow;
