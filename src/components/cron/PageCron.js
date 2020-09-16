import React, { useMemo, useEffect } from "react";
import { Redirect } from "react-router-dom";
import Cron, { QUARTZ } from "./cron";
import {
	ChecklistBox,
	CopyToClipboard,
	RadioOption,
	Tabs,
	TextBox
} from "../_lib";
import { useStore, actions } from "./PageCron.store";
import { mdiPlay } from "@mdi/js";
import Icon from "@mdi/react";
import styled from "styled-components";

const pageRoutes = ["crontab", "quartz"];

const InputWrapper = styled.div`
	display: flex;
	*:first-child {
		flex-grow: 1;
		width: 100%;
	}
	button {
		margin-left: 10px;
	}
`;

const Options = styled.div`
	padding: 10px;
`;

const ErrorText = styled.sup`
	color: red;
`;

const PageCron = ({ location }: { location: Object }) => {
	const pathSegments = location.pathname.substr(1).split("/");
	let type = pathSegments[1];
	if (!pageRoutes.includes(type)) {
		return <Redirect to={"/" + pathSegments[0] + "/" + pageRoutes[0]} />;
	}
	useEffect(() => actions.mode(type), [type]);

	const state = useStore();

	const mode = state.mode || type;
	const {
		[mode]: { exp, error, tab, gen }
	} = state;

	const allValuesFromOne = useMemo(
		() =>
			Array.from({ length: Cron.config.count[tab] }).map((x, i) => (
				<option key={i + 1} value={i + 1}>
					{i + 1}
				</option>
			)),
		[tab]
	);

	const namedValuesFromFirst = useMemo(
		() =>
			Array.from({ length: Cron.config.count[tab] }).map((x, i) => ({
				name: Cron.config.names[tab]
					? Cron.config.names[tab][Cron.config.first[tab] + i]
					: Cron.config.first[tab] + i,
				value:
					Cron.config.first[tab] +
					i +
					(tab === "day" && mode === QUARTZ ? 1 : 0)
			})),
		[tab]
	);
	const namedOptionsFromFirst = useMemo(
		() =>
			namedValuesFromFirst.map(x => (
				<option key={x.value} value={x.value}>
					{x.name}
				</option>
			)),
		[tab]
	);

	const domAllValuesFromOne = useMemo(
		() =>
			tab !== "day"
				? null
				: Array.from({ length: Cron.config.count[tab + "m"] }).map((x, i) => (
						<option key={i + 1} value={i + 1}>
							{i + 1}
						</option>
				  )),
		[tab]
	);

	const domNamedValuesFromFirst = useMemo(
		() =>
			tab !== "day"
				? null
				: Array.from({ length: Cron.config.count[tab + "m"] }).map((x, i) => ({
						name: Cron.config.names[tab + "m"]
							? Cron.config.names[tab + "m"][Cron.config.first[tab + "m"] + i]
							: Cron.config.first[tab + "m"] + i,
						value: Cron.config.first[tab + "m"] + i
				  })),
		[tab]
	);

	const domNamedOptionsFromFirst = useMemo(
		() =>
			tab !== "day"
				? null
				: Array.from({ length: Cron.config.count[tab + "m"] }).map((x, i) => (
						<option key={i} value={Cron.config.first[tab + "m"] + i}>
							{Cron.config.names[tab + "m"]
								? Cron.config.names[tab + "m"][Cron.config.first[tab + "m"] + i]
								: Cron.config.first[tab + "m"] + i}
						</option>
				  )),
		[tab]
	);

	const domAllValuesFromZero = useMemo(
		() =>
			tab !== "day"
				? null
				: Array.from({ length: Cron.config.count[tab + "m"] }).map((x, i) => (
						<option key={i} value={i}>
							{i}
						</option>
				  )),
		[tab]
	);

	const output = Cron.stringify(gen, mode);

	return (
		<div>
			<h1>Parse</h1>
			<span>Input expression:</span>
			<InputWrapper>
				<TextBox
					autoFocus
					selectOnFocus
					invalid={error}
					value={exp}
					onChange={actions.exp}
				/>
				<button className="icon" onClick={actions.parse} title="Parse">
					<Icon path={mdiPlay} size={1} />
				</button>
			</InputWrapper>
			{error && <ErrorText>{error}</ErrorText>}

			<h1>Create</h1>
			<Tabs>
				{mode === QUARTZ && (
					<div
						data-tab="second"
						aria-current={tab === "second" || null}
						onClick={actions.tab}
					>
						Seconds
					</div>
				)}
				<div
					data-tab="minute"
					aria-current={tab === "minute" || null}
					onClick={actions.tab}
				>
					Minutes
				</div>
				<div
					data-tab="hour"
					aria-current={tab === "hour" || null}
					onClick={actions.tab}
				>
					Hours
				</div>
				<div
					data-tab="day"
					aria-current={tab === "day" || null}
					onClick={actions.tab}
				>
					Day
				</div>
				<div
					data-tab="month"
					aria-current={tab === "month" || null}
					onClick={actions.tab}
				>
					Month
				</div>
				<div
					data-tab="year"
					aria-current={tab === "year" || null}
					onClick={actions.tab}
				>
					Year
				</div>
			</Tabs>

			<Options>
				<RadioOption
					id="opt_every"
					name={tab}
					label={`Every ${tab}`}
					checked={gen[tab].type === "*"}
					data-type="*"
					onChange={actions.type}
				/>
				{tab === "day" ? (
					<>
						<RadioOption
							id="opt_start"
							name={tab}
							checked={gen[tab].type === "w/"}
							data-type="w/"
							onChange={actions.type}
						>
							Every{" "}
							<select
								data-type="w/"
								value={gen[tab]["w/"][0]}
								onChange={actions.arg0}
							>
								{allValuesFromOne}
							</select>{" "}
							{tab}(s) starting on{" "}
							<select
								data-type="w/"
								value={gen[tab]["w/"][1]}
								onChange={actions.arg1}
							>
								{namedOptionsFromFirst}
							</select>
						</RadioOption>
						<RadioOption
							id="opt_start_m"
							name={tab}
							checked={gen[tab].type === "m/"}
							data-type="m/"
							onChange={actions.type}
						>
							Every{" "}
							<select
								data-type="m/"
								value={gen[tab]["m/"][0]}
								onChange={actions.arg0}
							>
								{domAllValuesFromOne}
							</select>{" "}
							{tab}(s) starting on the{" "}
							<select
								data-type="m/"
								value={gen[tab]["m/"][1]}
								onChange={actions.arg1}
							>
								{domNamedOptionsFromFirst}
							</select>{" "}
							of the month
						</RadioOption>
						<RadioOption
							id="opt_specific"
							name={tab}
							checked={gen[tab].type === "w,"}
							data-type="w,"
							onChange={actions.type}
						>
							Specific {tab}(s) of the week (multiple selection):{" "}
							<ChecklistBox
								label={`Choose ${tab} of the week`}
								options={namedValuesFromFirst}
								maxShowSelection={10}
								data-type="w,"
								value={gen[tab]["w,"]}
								onChange={actions.args}
							/>
						</RadioOption>
						<RadioOption
							id="opt_specific_m"
							name={tab}
							checked={gen[tab].type === "m,"}
							data-type="m,"
							onChange={actions.type}
						>
							Specific {tab}(s) of the month (multiple selection):{" "}
							<ChecklistBox
								label={`Choose ${tab} of the month`}
								options={domNamedValuesFromFirst}
								maxShowSelection={10}
								data-type="m,"
								value={gen[tab]["m,"]}
								onChange={actions.args}
							/>
						</RadioOption>
						{mode === QUARTZ && (
							<>
								<RadioOption
									id="opt_last_dom"
									name={tab}
									checked={gen[tab].type === "mL"}
									data-type="mL"
									onChange={actions.type}
								>
									<select
										data-type="mL"
										value={gen[tab]["mL"][0]}
										onChange={actions.arg0}
									>
										{domAllValuesFromZero}
									</select>{" "}
									day(s) before the end of the month (0 = Last day)
								</RadioOption>
								<RadioOption
									id="opt_last_wd"
									name={tab}
									checked={gen[tab].type === "mLW"}
									data-type="mLW"
									onChange={actions.type}
								>
									On the last weekday of the month
								</RadioOption>
								<RadioOption
									id="opt_near_wd"
									name={tab}
									checked={gen[tab].type === "mW"}
									data-type="mW"
									onChange={actions.type}
								>
									Nearest weekday to the{" "}
									<select
										data-type="mW"
										value={gen[tab]["mW"][0]}
										onChange={actions.arg0}
									>
										{domNamedOptionsFromFirst}
									</select>{" "}
									of the month
								</RadioOption>
								<RadioOption
									id="opt_last_dow"
									name={tab}
									checked={gen[tab].type === "wL"}
									data-type="wL"
									onChange={actions.type}
								>
									On the last{" "}
									<select
										data-type="wL"
										value={gen[tab]["wL"][0]}
										onChange={actions.arg0}
									>
										{namedOptionsFromFirst}
									</select>{" "}
									of the month
								</RadioOption>

								<RadioOption
									id="opt_nth_dow"
									name={tab}
									checked={gen[tab].type === "w#"}
									data-type="w#"
									onChange={actions.type}
								>
									On the{" "}
									<select
										data-type="w#"
										value={gen[tab]["w#"][1]}
										onChange={actions.arg1}
									>
										{domNamedOptionsFromFirst.slice(0, 5)}
									</select>{" "}
									<select
										data-type="w#"
										value={gen[tab]["w#"][0]}
										onChange={actions.arg0}
									>
										{namedOptionsFromFirst}
									</select>{" "}
									of the month
								</RadioOption>

								<strong>*Weekday = Monday to Friday</strong>
							</>
						)}
					</>
				) : (
					<>
						<RadioOption
							id="opt_start"
							name={tab}
							checked={gen[tab].type === "/"}
							data-type="/"
							onChange={actions.type}
						>
							Every{" "}
							<select
								data-type="/"
								value={gen[tab]["/"][0]}
								onChange={actions.arg0}
							>
								{allValuesFromOne}
							</select>{" "}
							{tab}(s) starting at {tab}{" "}
							<select
								data-type="/"
								value={gen[tab]["/"][1]}
								onChange={actions.arg1}
							>
								{namedOptionsFromFirst}
							</select>
						</RadioOption>

						<RadioOption
							id="opt_specific"
							name={tab}
							checked={gen[tab].type === ","}
							data-type=","
							onChange={actions.type}
						>
							Specific {tab}(s) (multiple selection):{" "}
							<ChecklistBox
								label={`Choose ${tab}`}
								options={namedValuesFromFirst}
								maxShowSelection={10}
								data-type=","
								value={gen[tab][","]}
								onChange={actions.args}
							/>
						</RadioOption>

						<RadioOption
							id="opt_range"
							name={tab}
							checked={gen[tab].type === "-"}
							data-type="-"
							onChange={actions.type}
						>
							Every {tab} between{" "}
							<select
								data-type="-"
								value={gen[tab]["-"][0]}
								onChange={actions.arg0}
							>
								{namedOptionsFromFirst}
							</select>{" "}
							and{" "}
							<select
								data-type="-"
								value={gen[tab]["-"][1]}
								onChange={actions.arg1}
							>
								{namedOptionsFromFirst}
							</select>
						</RadioOption>
					</>
				)}
			</Options>

			<span>Output Expression:</span>
			<CopyToClipboard from="cron_exp" />
			<TextBox id="cron_exp" readOnly value={output} />
		</div>
	);
};

export default PageCron;
