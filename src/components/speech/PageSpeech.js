import React, { useCallback, useMemo, useEffect } from "react";
import { TextArea, ListBox } from "../_lib";
import { useStore, actions } from "./PageSpeech.store";
import { speak, synth } from "./speech";
import styled from "styled-components";

import { mdiPlay, mdiPause, mdiStop } from "@mdi/js";
import Icon from "@mdi/react";

const RangeWrapper = styled.label`
	display: flex !important;
	margin-bottom: 20px !important;
	span {
		display: inline-block;
		width: 90px;
	}
	input[type="range"] {
		flex: 1;
	}
`;

const pause = () => {
	if (!synth.paused) {
		synth.pause();
	}
	actions.pause();
};

const stop = () => {
	if (synth.speaking || synth.pending) {
		synth.cancel();
	}
	actions.stop();
};

const resume = () => {
	if (synth.paused) {
		synth.resume();
	}
	actions.resume();
};

const PageSpeech = () => {
	const { input, pitch, rate, voices, voice, speaking, paused } = useStore();

	useEffect(() => {
		actions.voices();
		synth.addEventListener("voiceschanged", actions.voices);
		return () => synth.removeEventListener("voiceschanged", actions.voices);
	}, []);

	const play = useCallback(() => {
		speak({
			input,
			pitch,
			rate,
			voice: voices.find(v => v.name === voice)
		}).then(() => {
			actions.stop();
		});
		actions.speak();
	}, [input, pitch, rate, voices, voice]);

	const voicesList = useMemo(() => {
		return voices.map(voice => ({
			value: voice.name,
			name: `${voice.name} (${voice.lang})${voice.default ? " *" : ""}`
		}));
	}, [voices]);

	return (
		<div>
			<h1>Synthesis</h1>

			<label>
				Text to speak:
				<TextArea
					disabled={speaking}
					autoFocus
					selectOnFocus
					value={input}
					onChange={actions.input}
				/>
			</label>

			<label>
				Voice:
				<ListBox
					disabled={speaking}
					size={1}
					options={voicesList}
					value={voice}
					onChange={actions.voice}
				/>
			</label>

			<RangeWrapper>
				<span>Pitch ({pitch})</span>
				<input
					disabled={speaking}
					type="range"
					min="0"
					max="2"
					step="0.1"
					value={pitch}
					onChange={actions.pitch}
				/>
			</RangeWrapper>

			<RangeWrapper>
				<span>Rate ({rate})</span>
				<input
					disabled={speaking}
					type="range"
					min="0.5"
					max="2"
					step="0.1"
					value={rate}
					onChange={actions.rate}
				/>
			</RangeWrapper>

			<div>
				<button
					className="icon"
					onClick={speaking ? resume : play}
					disabled={speaking && !paused}
				>
					<Icon path={mdiPlay} />
				</button>
				&nbsp;
				<button className="icon" onClick={pause} disabled={!speaking || paused}>
					<Icon path={mdiPause} />
				</button>
				&nbsp;
				<button className="icon" onClick={stop} disabled={!speaking}>
					<Icon path={mdiStop} />
				</button>
			</div>
		</div>
	);
};

export default PageSpeech;
