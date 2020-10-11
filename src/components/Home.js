import React from "react";
import jokes from "../jokes";

import Logo from "!!react-svg-loader!../assets/devek_text_white.svg";
import DevekCube from "./webgl/DevekCube";
import styled from "styled-components";

const dayOfTheYear = ~~(
	(Date.now() - new Date(new Date().getFullYear() + "-01-01")) /
	864e5
);
const jokeOfTheDay = jokes[dayOfTheYear % jokes.length];

const Page = styled.div`
	padding: 0 20px;
	text-align: center;
	max-width: 560px;
	margin: 0 auto;

	svg {
		margin-top: 40px;
		margin-bottom: 40px;
		color: ${({ theme }) => (theme.dark ? "#fff" : "#000")};
	}
	p {
		margin: 0;
	}
	p:last-of-type {
		margin-top: 40px;
	}
	footer {
		margin-top: 40px;
		font-size: 0.8em;
	}
	table {
		font-size: 12px;
		display: inline-block;
		text-align: left;
		margin-top: 40px;
		caption {
			font-weight: bold;
		}
		td:first-of-type {
			font-weight: bold;
			padding-right: 10px;
			text-align: right;
		}
	}
	a:link,
	a:visited,
	a:hover,
	a:active {
		color: ${({ theme }) => theme.secondaryColor};
	}
`;

const JokeHeader = styled.div`
	margin-top: 20px;
	font-weight: bold;
`;
const Joke = styled.div`
	white-space: pre-wrap;
`;

const Home = () => (
	<Page>
		<Logo width="280px" height="90px" />

		<DevekCube />

		<p>
			<strong>Helping tools for developers</strong>
			<br />
			<strong>Everything</strong> is done on the client side,
			<br />
			your information is <strong>safe</strong>!<br />
		</p>

		<JokeHeader>🤣 Joke of the day:</JokeHeader>
		<Joke>{jokeOfTheDay}</Joke>

		<p>
			Press <kbd>/</kbd> for quick search
		</p>

		<table>
			<caption>Third-party libraries</caption>
			<tbody>
				<tr>
					<td>@mdi/js & @mdi/react</td>
					<td>MIT - Copyright © Austin Andrews</td>
				</tr>
				<tr>
					<td>core-js</td>
					<td>MIT - Copyright © Denis Pushkarev</td>
				</tr>
				<tr>
					<td>react & react-dom</td>
					<td>MIT - Copyright © Facebook, Inc. and its affiliates</td>
				</tr>
				<tr>
					<td>react-router-dom</td>
					<td>MIT - Copyright © React Training</td>
				</tr>
				<tr>
					<td>styled-components</td>
					<td>MIT - Copyright © Glen Maddern and Maximilian Stoiber</td>
				</tr>
			</tbody>
		</table>

		<footer>
			<strong>Developed & Hosted</strong> with <span className="emoji">❤</span>{" "}
			by <a href="https://github.com/elisherer">elisherer</a>
		</footer>
	</Page>
);

export default Home;
