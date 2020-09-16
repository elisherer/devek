import createStore from "helpers/createStore";

const actionCreators = {
	input: e => state => ({ ...state, input: e.target.value })
};

const initialState = {
	input: location.href
};

export const { actions, useStore } = createStore(
	actionCreators,
	initialState,
	"url"
);
