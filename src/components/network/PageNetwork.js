import React, { useEffect } from "react";
import { CopyToClipboard, TextBox } from "../_lib";
import { useStore, actions } from "./PageNetwork.store";
import { formatters, isPrivate } from "./network";
import { getAsync } from "helpers/http";
import styled from "styled-components";

const fetchIP = () => {
	let cancelled = false;
	getAsync("/api/ip", "json")
		.then((res: { ip_address: string }) => {
			!cancelled && actions.myIP(res.ip_address);
		})
		.catch(e => {
			!cancelled && actions.myIP(e.message);
		});
	return () => {
		cancelled = true;
	};
};

const MyIP = styled.div`
	font-size: 18px;
	margin-bottom: 20px;
`;

const Table = styled.table`
	font-size: 12px;
	th {
		text-align: left;
	}
`;

const PageNetwork = () => {
	useEffect(fetchIP, []);

	const { myIP, errors, ipv4, subnet, mask, parsed } = useStore();
	const wildcard = 0xffffffff - mask;
	const network = (parsed & mask) >>> 0;

	return (
		<div>
			<dt key="network_ip_address" />

			<MyIP>
				My IP Address: <strong id="ip_myip">{myIP || "fetching..."}</strong>{" "}
				<CopyToClipboard from="ip_myip" />
			</MyIP>

			<span>IPv4:</span>
			<TextBox
				invalid={errors.ipv4}
				autoFocus
				onChange={actions.ipv4}
				value={ipv4}
			/>

			<label>
				<span>Subnet ({subnet})</span>
				<input
					type="range"
					min="8"
					max="32"
					value={subnet}
					onChange={actions.subnet}
				/>
			</label>

			<label>Info:</label>
			{parsed && (
				<Table>
					<colgroup>
						<col />
						<col />
						<col />
					</colgroup>
					<thead>
						<tr>
							<th>Name</th>
							<th>Value</th>
							<th>Binary</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Address</td>
							<td>{formatters.ipv4(parsed)}</td>
							<td>{formatters.ipv4_binary(parsed)}</td>
						</tr>
						<tr>
							<td>Netmask</td>
							<td>{formatters.ipv4(mask)}</td>
							<td>{formatters.ipv4_binary(mask)}</td>
						</tr>
						<tr>
							<td>Wildcard</td>
							<td>{formatters.ipv4(wildcard)}</td>
							<td>{formatters.ipv4_binary(wildcard)}</td>
						</tr>
						<tr>
							<td>Class</td>
							<td>{formatters.class(parsed) || "Unknown"}</td>
							<td />
						</tr>
						<tr>
							<td>Network</td>
							<td>
								{formatters.ipv4(network)}/{subnet}
							</td>
							<td>{formatters.ipv4_binary(network)}</td>
						</tr>
						<tr>
							<td>Broadcast</td>
							<td>{formatters.ipv4(network + wildcard)}</td>
							<td>{formatters.ipv4_binary(network + wildcard)}</td>
						</tr>
						<tr>
							<td>HostMin</td>
							<td>{formatters.ipv4(network + 1)}</td>
							<td>{formatters.ipv4_binary(network + 1)}</td>
						</tr>
						<tr>
							<td>HostMax</td>
							<td>{formatters.ipv4(network + wildcard - 1)}</td>
							<td>{formatters.ipv4_binary(network + wildcard - 1)}</td>
						</tr>
						<tr>
							<td>Hosts</td>
							<td>{Math.pow(2, 32 - subnet) - 2}</td>
							<td />
						</tr>
						<tr>
							<td>Private</td>
							<td>{isPrivate(parsed) ? "Yes" : "No"}</td>
							<td />
						</tr>
						<tr>
							<td>Int/Hex</td>
							<td>{parsed}</td>
							<td>0x{parsed.toString(16)}</td>
						</tr>
						<tr>
							<td>IPv6</td>
							<td />
							<td>
								0:0:0:0:0:ffff:{(parsed >>> 16).toString(16).padStart(4, "0")}:
								{(parsed & 0xff).toString(16).padStart(4, "0")}
							</td>
						</tr>
					</tbody>
				</Table>
			)}
		</div>
	);
};

export default PageNetwork;
