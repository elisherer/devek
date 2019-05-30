import React, {useEffect} from 'react';
import TextBox from '../../lib/TextBox';
import CopyToClipboard from "../../lib/CopyToClipboard";
import { useStore, actions } from './PageNetwork.store';
import { formatters, isPrivate } from './network';
import zPad from 'helpers/zPad';
import styles from './PageNetwork.less';

const PageNetwork = () => {
  useEffect(actions.ip, []);

  const { ip, errors, ipv4, subnet, mask, parsed } = useStore();
  const wildcard = 0xffffffff - mask;
  const network = (parsed & mask) >>> 0;

  return (
    <div>
      <dt key="network_ip_address" />

      <div className={styles.my_ip}>
        My IP Address: <strong>{ip || "fetching..."}</strong>
      </div>

      <span>IPv4:</span><CopyToClipboard from="network_ipv4"/>
      <TextBox invalid={errors.ipv4} id="network_ipv4" autoFocus onChange={actions.ipv4} value={ipv4} />

      <label>
        <span>Subnet ({subnet})</span>
        <input type="range" min="8" max="32" value={subnet} onChange={actions.subnet}/>
      </label>

      <label>Info:</label>
      {parsed && (
        <table className={styles.table}>
          <colgroup>
            <col /><col /><col />
          </colgroup>
          <thead>
          <tr><th>Name</th><th>Value</th><th>Binary</th></tr>
          </thead>
          <tbody>
          <tr><td>Address</td><td>{formatters.ipv4(parsed)}</td><td>{formatters.ipv4_binary(parsed)}</td></tr>
          <tr><td>Netmask</td><td>{formatters.ipv4(mask)}</td><td>{formatters.ipv4_binary(mask)}</td></tr>
          <tr><td>Wildcard</td><td>{formatters.ipv4(wildcard)}</td><td>{formatters.ipv4_binary(wildcard)}</td></tr>
          <tr><td>Class</td><td>{formatters.class(parsed) || "Unknown"}</td><td /></tr>
          <tr><td>Network</td><td>{formatters.ipv4(network)}/{subnet}</td><td>{formatters.ipv4_binary(network)}</td></tr>
          <tr><td>Broadcast</td><td>{formatters.ipv4(network + wildcard)}</td><td>{formatters.ipv4_binary(network + wildcard)}</td></tr>
          <tr><td>HostMin</td><td>{formatters.ipv4(network + 1)}</td><td>{formatters.ipv4_binary(network + 1)}</td></tr>
          <tr><td>HostMax</td><td>{formatters.ipv4(network + wildcard - 1)}</td><td>{formatters.ipv4_binary(network + wildcard - 1)}</td></tr>
          <tr><td>Hosts</td><td>{Math.pow(2, 32 - subnet) - 2}</td><td /></tr>
          <tr><td>Private</td><td>{isPrivate(parsed) ? "Yes" : "No"}</td><td /></tr>
          <tr><td>Int/Hex</td><td>{parsed}</td><td>0x{parsed.toString(16)}</td></tr>
          <tr><td>IPv6</td><td /><td>0:0:0:0:0:ffff:{zPad((parsed >>> 16).toString(16), 4)}:{zPad((parsed & 0xff).toString(16), 4)}</td></tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PageNetwork;