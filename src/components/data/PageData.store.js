import createStore from "helpers/createStore";
import * as data from "./data";

const initialState = {
	input: "",
	pickedAction: "Split",
	parameters: {},
	pipe: [],
	selected: -1,
	running: false,
	output: ""
};

const pipeAction = state => {
	const result = {
		action: state.pickedAction
	};
	if (data.actions[state.pickedAction].parameters) {
		result.parameters = Object.keys(
			data.actions[state.pickedAction].parameters
		).reduce((a, c) => {
			a[c] =
				state.parameters[c] || data.actions[state.pickedAction].defaults[c];
			return a;
		}, {});
	}
	return result;
};

const actionCreators = {
	input: e => state => ({ ...state, input: e.target.innerText }),
	pickedAction: e => state => ({ ...state, pickedAction: e.target.value }),
	parameter: e => state => ({
		...state,
		parameters: { ...state.parameters, [e.target.dataset.name]: e.target.value }
	}),
	pipe: () => state => ({
		...state,
		pipe: state.pipe.concat(pipeAction(state)),
		selected: state.pipe.length
	}),
	selectAction: e => state => ({
		...state,
		selected: parseInt(e.target.selectedIndex),
		pickedAction: state.pipe[e.target.selectedIndex].action,
		parameters: state.pipe[e.target.selectedIndex].parameters
	}),
	moveDown: () => state => {
		if (state.selected === -1 || state.selected === state.pipe.length - 1)
			return state;
		const clone = state.pipe.slice();
		clone.splice(state.selected + 1, 0, clone.splice(state.selected, 1)[0]);
		return {
			...state,
			pipe: clone,
			selected: state.selected + 1
		};
	},
	moveUp: () => state => {
		if (state.selected <= 0) return state;
		const clone = state.pipe.slice();
		clone.splice(state.selected - 1, 0, clone.splice(state.selected, 1)[0]);
		return {
			...state,
			pipe: clone,
			selected: state.selected - 1
		};
	},
	update: () => state => {
		if (state.selected === -1) return state;
		return {
			...state,
			pipe: state.pipe.map((a, i) =>
				i !== state.selected ? a : pipeAction(state)
			)
		};
	},
	remove: () => state => {
		if (state.selected === -1) return state;
		const pipe = state.pipe.filter((a, i) => i !== state.selected);
		const newIndex = Math.min(state.selected, pipe.length - 1);
		return {
			...state,
			pipe,
			selected: state.selected < 0 ? 0 : newIndex
		};
	},
	import: pipe => () => ({ ...initialState, pipe }),
	runStart: () => state => ({
		...state,
		running: true
	}),
	runFinished: result => state => ({
		...state,
		timestamp: new Date(),
		running: false,
		output: Array.isArray(result)
			? result.length === 1
				? result[0]
				: JSON.stringify(result, null, 2)
			: result
	})
};

export const { actions, useStore } = createStore(
	actionCreators,
	initialState,
	"data"
);
