import createStore from "helpers/createStore";
import { diffText } from "./diff";

const actionCreators = {
	inputA: e => state => ({ ...state, inputA: e.target.innerText }),
	inputB: e => state => ({ ...state, inputB: e.target.innerText }),
	trimSpace: e => state => ({ ...state, trimSpace: e.target.checked }),
	ignoreSpace: e => state => ({ ...state, ignoreSpace: e.target.checked }),
	ignoreCase: e => state => ({ ...state, ignoreCase: !e.target.checked }),
	lineDiff: () => state => {
		const result = diffText(
			state.inputA,
			state.inputB,
			state.trimSpace,
			state.ignoreSpace,
			state.ignoreCase,
			"\n"
		);
		return { ...state, result, type: "line" };
	},
	blockDiff: () => state => {
		const result = diffText(
			state.inputA,
			state.inputB,
			state.trimSpace,
			state.ignoreSpace,
			state.ignoreCase,
			/\b/g
		);
		return { ...state, result, type: "block" };
	}
};

export const initialState = {
	inputA: "",
	inputB: "",
	trimSpace: false,
	ignoreSpace: false,
	ignoreCase: false,
	result: "",
	type: ""
};

export const { actions, useStore } = createStore(
	actionCreators,
	initialState,
	"diff"
);
