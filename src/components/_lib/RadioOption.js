import React from "react";
import styled from "styled-components";

const Mark = styled.span`
	position: absolute;
	top: 2px;
	left: 2px;
	height: 20px;
	width: 20px;
	border: 2px solid ${({ theme }) => theme.radioBorder};
	border-radius: 20px;

	&:after {
		position: absolute;
		content: "";
		display: none;
		left: 3px;
		top: 3px;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: ${({ theme }) => theme.secondaryColor};
	}

	input[type="radio"]:checked ~ &:after {
		display: block;
	}
	input[type="radio"]:focus ~ & {
		border-color: ${({ theme }) => theme.secondaryColor};
	}
`;

const OptionLabel = styled.label`
	display: block;
	position: relative;
	padding-left: 35px;
	margin-bottom: 12px;
	cursor: pointer;
	user-select: none;

	input {
		position: absolute;
		opacity: 0;
		cursor: pointer;
		height: 0;
		width: 0;
	}
`;

const RadioOption = ({
	label,
	children,
	...props
}: {
	label: string,
	children: any,
	id: string
}) => (
	<OptionLabel htmlFor={props.id}>
		{children || label}
		<input type="radio" {...props} />
		<Mark />
	</OptionLabel>
);

export default RadioOption;
