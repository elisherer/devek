let id = 0;

const consoleLogger = (name, type, payload) => {
	console.info(
		// eslint-disable-line
		"🐛 %c" +
			(name || "no-name") +
			": %cType = %c" +
			type +
			"%c, Payload = %c" +
			JSON.stringify(payload),
		"font-weight: bold",
		"",
		"font-weight: bold",
		"",
		"font-size: 8px"
	);
};

export default ({ name, init, initialState, store }) => {
	const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__;
	if (!reduxDevTools) return consoleLogger;

	const instanceID = id++;
	const devTools = reduxDevTools.connect({
		name: `${name} - ${instanceID}`,
		features: { jump: true }
	});

	devTools.subscribe(data => {
		switch (data.type) {
			case "START":
				devTools.init(init());
				break;
			case "RESET":
				store.setState(initialState);
				break;
			case "DISPATCH":
				switch (data.payload.type) {
					case "JUMP_TO_STATE":
					case "JUMP_TO_ACTION": {
						store.setState(JSON.parse(data.state));
						break;
					}
					default:
						break;
				}
				break;
			default:
				break;
		}
	});

	return (name, type, payload) => {
		devTools.send(
			{ type: `${name}/${type}`, payload },
			payload,
			{},
			instanceID
		);
	};
};
