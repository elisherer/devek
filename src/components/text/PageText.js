import React, { useCallback, useState } from "react";
import {
	CopyToClipboard,
	ChecklistBox,
	Radio,
	TextArea,
	Checkbox
} from "../_lib";
import { textCategories, textFunctions } from "./text";
import { Redirect, NavLink } from "react-router-dom";
import { useStore, actions } from "./PageText.store";
import styled from "styled-components";
import charmap from "./charmap";

const hexFormat = num => "0x" + num.toString(16).toUpperCase();
const charmapCategoriesByAlpha = charmap
	.sort((a, b) => a[0].localeCompare(b[0]))
	.map(x => ({
		name: `${x[0]} (${hexFormat(x[1])}-${hexFormat(x[2])})`,
		value: x[0],
		start: x[1]
	}));
const charmapCategoriesByCode = charmapCategoriesByAlpha
	.slice()
	.sort((a, b) => a.start - b.start);

const TextAreaWithValidation = styled(TextArea)`
	pre {
		color: ${({ error }) => (error ? "red" : "inherit")};
	}
`;

const AlignToRight = styled.div`
	text-align: right;
`;

const I = styled.i`
	display: inline-block;
	font-style: normal;
	padding: 5px;
	border: 1px solid #dddddd;
	margin: 4px;
	border-radius: 4px;
	cursor: pointer;
	width: 2em;
	text-align: center;
`;

const PageText = ({ location }: { location: Object }) => {
	const pathSegments = location.pathname.substr(1).split("/");
	const category = pathSegments[1];
	if (!category) {
		const firstTextFunc = Object.keys(
			textFunctions[textCategories[0].category]
		)[0];
		return (
			<Redirect
				to={`/${pathSegments[0]}/${textCategories[0].category}/${firstTextFunc}`}
			/>
		);
	}

	const textFunc = pathSegments[2];
	if (!textFunc && category !== "charmap") {
		const firstTextFunc = Object.keys(textFunctions[category])[0];
		return <Redirect to={`/${pathSegments[0]}/${category}/${firstTextFunc}`} />;
	}

	const [sortAlpha, setSortAlpha] = useState(false);
	const handleSortChange = useCallback(() => setSortAlpha(!sortAlpha), [
		sortAlpha
	]);
	const state = useStore();

	if (category === "charmap") {
		const charMap = [];
		charmap.forEach(range => {
			if (state.charmap.categories.includes(range[0])) {
				const submap = [];
				for (let j = range[1]; j <= range[2]; j++) {
					submap.push(
						<I key={range[0] + j} title={hexFormat(j) + " (" + j + ")"}>
							{String.fromCodePoint(j)}
						</I>
					);
				}
				charMap.push(
					<div key={range[0]}>
						<h1>{range[0]}</h1>
						{submap}
					</div>
				);
			}
		});
		return (
			<div>
				<Checkbox
					label="Sort alphabetically"
					checked={sortAlpha}
					onChange={handleSortChange}
				/>
				<br />
				<ChecklistBox
					label="Select a sub-range:"
					inline
					options={
						sortAlpha ? charmapCategoriesByAlpha : charmapCategoriesByCode
					}
					value={state.charmap.categories}
					onChange={actions.charmap}
					maxShowSelection={2}
				/>
				{charMap}
			</div>
		);
	}

	const { input } = state;
	let output,
		error = null;
	const ctf = textFunctions[category][textFunc];
	try {
		output = input ? ctf.func(input) : "";
	} catch (e) {
		error = e.message;
	}

	return (
		<div>
			<Radio flexBasis={25}>
				{Object.keys(textFunctions[category]).map(tf => {
					return (
						<NavLink
							key={tf}
							to={"/" + pathSegments[0] + "/" + pathSegments[1] + "/" + tf}
						>
							{textFunctions[category][tf].title}
						</NavLink>
					);
				})}
			</Radio>

			<label>Input:</label>
			<TextArea autoFocus onChange={actions.input} value={input} />
			<AlignToRight>
				<sup>Length: {input.length}</sup>
			</AlignToRight>

			<span>Output:</span>
			<CopyToClipboard from="text_output" />
			<TextAreaWithValidation
				id="text_output"
				readOnly
				error={error}
				style={ctf.style}
				value={error || output}
			/>
			<AlignToRight>
				<sup>
					&nbsp;{!error && output.length > 0 ? "Length: " + output.length : ""}
				</sup>
			</AlignToRight>
		</div>
	);
};

export default PageText;
