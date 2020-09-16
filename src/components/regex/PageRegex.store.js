import createStore from "helpers/createStore";
import support from "helpers/support";

const composeFlags = on =>
	support.RegExpFlags.filter(flag => on.includes(flag)).join("");

const actionCreators = {
	regex: e => state => ({ ...state, regex: e.target.value }),
	flags: e => state => ({
		...state,
		flags: state.flags.includes(e.target.dataset.flag)
			? state.flags.replace(e.target.dataset.flag, "")
			: composeFlags(state.flags + e.target.dataset.flag)
	}),
	testString: e => state => ({ ...state, test: e.target.innerText }),
	withReplace: e => state => ({ ...state, withReplace: e.target.checked }),
	replace: e => state => ({ ...state, replace: e.target.value })
};

const initialState = {
	regex: "",
	flags: "gm",
	test: "",
	withReplace: false,
	replace: "$&"
};

export const { actions, useStore } = createStore(
	actionCreators,
	initialState,
	"regex"
);
