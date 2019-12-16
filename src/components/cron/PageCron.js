import React, { useMemo } from 'react';
import Cron from './cron';
import { ChecklistBox, CopyToClipboard, RadioOption, Tabs, TextBox } from '../_lib';
import { useStore, actions } from './PageCron.store';

import styles from './PageCron.less';

const PageCron = () => {
  const { exp, error, tab, gen, gen_output } = useStore();
  
  const everyOptions1 = useMemo(() =>
    Array.from({ length: Cron.config.count[tab] }).map((x, i) => <option key={i+1} value={i+1}>{i+1}</option>)
  , [tab]);

  const everyOptions2 = useMemo(() => 
    Array.from({ length: Cron.config.count[tab] }).map((x, i) => <option key={i} value={Cron.config.first[tab] + i}>{Cron.config.names[tab] ? Cron.config.names[tab][Cron.config.first[tab]+i] : (Cron.config.first[tab]+i)}</option>)
  , [tab]);

  const specificOptions = useMemo(() => 
    Array.from({ length: Cron.config.count[tab] }).map((x, i) => ({ name: Cron.config.names[tab] ? Cron.config.names[tab][Cron.config.first[tab]+i] : (Cron.config.first[tab]+i),value: Cron.config.first[tab]+i }))
  , [tab]);

  return (
    <div>
      <h1>Parse</h1>
      <span>Input expression:</span>
      <TextBox autoFocus selectOnFocus invalid={error}
               value={exp} onChange={actions.exp} />
      Parse as:
      <div className={styles.parses}>
        <button onClick={actions.parseCrontab}>Crontab</button>
        <button onClick={actions.parseQuartz}>Quartz</button>
      </div>
      <h1>Create</h1>
      <Tabs>
        <div data-tab="second" aria-current={tab === 'second' || null} onClick={actions.tab}>Seconds</div>
        <div data-tab="minute" aria-current={tab === 'minute' || null} onClick={actions.tab}>Minutes</div>
        <div data-tab="hour" aria-current={tab === 'hour' || null} onClick={actions.tab}>Hours</div>
        <div data-tab="day" aria-current={tab === 'day' || null} onClick={actions.tab}>Day</div>
        <div data-tab="month" aria-current={tab === 'month' || null} onClick={actions.tab}>Month</div>
        <div data-tab="year" aria-current={tab === 'year' || null} onClick={actions.tab}>Year</div>
      </Tabs>
      
      <div className={styles.options}>
        {tab === 'day' ? (
          <>
          
          </>
        ) : (
          <>
            <RadioOption id="opt_every" name={tab} label={`Every ${tab}`} checked={gen[tab].type === '*'} 
                     data-type="*" onChange={actions.type}/>
        
            <RadioOption id="opt_start" name={tab} checked={gen[tab].type === '/'} 
                        data-type="/" onChange={actions.type}>
              Every <select data-type="/" 
                            value={gen[tab]['/'][0]} 
                            onChange={actions.arg0}>
                      {everyOptions1}
                    </select> {tab}(s) starting at {tab} <select data-type="/" 
                                                                value={gen[tab]['/'][1]} 
                                                                onChange={actions.arg1}>
                                                          {everyOptions2}
                                                        </select>
            </RadioOption>
            
            <RadioOption id="opt_specific" name={tab} label={`Specific ${tab} (multiple)`} checked={gen[tab].type === ','} 
                        data-type="," onChange={actions.type}>
              Specific {tab}(s) (multiple selection): <ChecklistBox label={`Choose ${tab}`} options={specificOptions} maxShowSelection={10} 
                            data-type="," value={gen[tab][',']} onChange={actions.args}/>
            </RadioOption>
            
            <RadioOption id="opt_range" name={tab} checked={gen[tab].type === '-'} 
                        data-type="-" onChange={actions.type}>
              Every {tab} between <select data-type="-" 
                                          value={gen[tab]['-'][0]}
                                          onChange={actions.arg0}>
                                    {everyOptions2}
                                  </select> and <select data-type="-" 
                                                        value={gen[tab]['-'][1]}
                                                        onChange={actions.arg1}>
                                                  {everyOptions2}
                                                </select>
            </RadioOption>
          </>
        )
      }
      </div>

      <span>Output Expression:</span><CopyToClipboard from="cron_exp"/>
      <TextBox id="cron_exp" readOnly value={gen_output} />

    </div>
  );
};

export default PageCron;