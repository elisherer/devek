import React, { useMemo } from 'react';
import Cron from './cron';
import { ChecklistBox, CopyToClipboard, RadioOption, Tabs, TextBox } from '../_lib';
import { useStore, actions } from './PageCron.store';

import styles from './PageCron.less';

const PageCron = () => {
  const { exp, error, tab, gen, gen_output } = useStore();
  
  const everyOptions1 = useMemo(() =>
    Array.from({ length: Cron.config.count[tab] }).map((x, i) => 
      <option key={i+1} value={i+1}>{i+1}</option>
    )
  , [tab]);

  const everyOptions2 = useMemo(() => 
    Array.from({ length: Cron.config.count[tab] }).map((x, i) => 
      <option key={i} value={Cron.config.first[tab] + i}>{Cron.config.names[tab] ? Cron.config.names[tab][Cron.config.first[tab]+i] : (Cron.config.first[tab]+i)}</option>
    )
  , [tab]);

  const everyOptions3 = useMemo(() => tab !== 'day' ? null :
    Array.from({ length: Cron.config.count[tab+'m'] }).map((x, i) => 
      <option key={i} value={Cron.config.first[tab+'m'] + i}>{Cron.config.names[tab+'m'] ? Cron.config.names[tab+'m'][Cron.config.first[tab+'m']+i] : (Cron.config.first[tab+'m']+i)}</option>
    )
  , [tab]);

  const everyOptions4 = useMemo(() => tab !== 'day' ? null :
    Array.from({ length: Cron.config.count[tab+'m'] }).map((x, i) => 
      <option key={i+1} value={i+1}>{i+1}</option>
    )
  , [tab]);

  const everyOptions5 = useMemo(() => tab !== 'day' ? null :
    Array.from({ length: Cron.config.count[tab+'m'] }).map((x, i) => 
      <option key={i} value={i}>{i}</option>
    )
  , [tab]);

  const specificOptions = useMemo(() => 
    Array.from({ length: Cron.config.count[tab] }).map((x, i) => ({ name: Cron.config.names[tab] ? Cron.config.names[tab][Cron.config.first[tab]+i] : (Cron.config.first[tab]+i),value: Cron.config.first[tab]+i }))
  , [tab]);

  const specificOptions2 = useMemo(() => tab !== 'day' ? null :
    Array.from({ length: Cron.config.count[tab+'m'] }).map((x, i) => ({ name: Cron.config.names[tab+'m'] ? Cron.config.names[tab+'m'][Cron.config.first[tab+'m']+i] : (Cron.config.first[tab+'m']+i),value: Cron.config.first[tab+'m']+i }))
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
        <RadioOption id="opt_every" name={tab} label={`Every ${tab}`} checked={gen[tab].type === '*'} 
                     data-type="*" onChange={actions.type}/>
        {tab === 'day' ? (
          <>
            <RadioOption id="opt_start" name={tab} checked={gen[tab].type === 'w/'} 
                        data-type="w/" onChange={actions.type}>
              Every <select data-type="w/"
                            value={gen[tab]['w/'][0]} 
                            onChange={actions.arg0}>
                      {everyOptions1}
                    </select> {tab}(s) starting on <select data-type="w/" 
                                                                value={gen[tab]['w/'][1]} 
                                                                onChange={actions.arg1}>
                                                          {everyOptions2}
                                                        </select>
            </RadioOption>
            <RadioOption id="opt_start_m" name={tab} checked={gen[tab].type === 'm/'} 
                        data-type="m/" onChange={actions.type}>
              Every <select data-type="m/"
                            value={gen[tab]['m/'][0]} 
                            onChange={actions.arg0}>
                      {everyOptions4}
                    </select> {tab}(s) starting on the <select data-type="m/" 
                                                                value={gen[tab]['m/'][1]} 
                                                                onChange={actions.arg1}>
                                                          {everyOptions3}
                                                        </select> of the month
            </RadioOption>
            <RadioOption id="opt_specific" name={tab} checked={gen[tab].type === 'w,'} 
                        data-type="w," onChange={actions.type}>
              Specific {tab}(s) of the week (multiple selection): <ChecklistBox label={`Choose ${tab} of the week`} options={specificOptions} maxShowSelection={10} 
                            data-type="w," value={gen[tab]['w,']} onChange={actions.args}/>
            </RadioOption>
            <RadioOption id="opt_specific_m" name={tab} checked={gen[tab].type === 'm,'} 
                        data-type="m," onChange={actions.type}>
              Specific {tab}(s) of the month  (multiple selection): <ChecklistBox label={`Choose ${tab} of the month`} options={specificOptions2} maxShowSelection={10} 
                            data-type="m," value={gen[tab]['m,']} onChange={actions.args}/>
            </RadioOption>
            <RadioOption id="opt_last_dom" name={tab} checked={gen[tab].type === 'mL'}
                        data-type="mL" onChange={actions.type}>
              <select data-type="mL" value={gen[tab]['mL'][0]} onChange={actions.arg0}>
                {everyOptions5}
              </select> day(s) before the end of the month (0 = Last day)</RadioOption>
            <RadioOption id="opt_last_wd" name={tab} checked={gen[tab].type === 'mLW'} 
                        data-type="mLW" onChange={actions.type}>
              On the last weekday of the month
            </RadioOption>         
            <RadioOption id="opt_near_wd" name={tab} checked={gen[tab].type === 'mW'} 
                        data-type="mW" onChange={actions.type}>
              Nearest weekday to the <select data-type="mW" value={gen[tab]['mW'][0]} onChange={actions.arg0}>
                                       {everyOptions3}
                                     </select> of the month
            </RadioOption>
            <RadioOption id="opt_last_dow" name={tab} checked={gen[tab].type === 'wL'} 
                        data-type="wL" onChange={actions.type}>
              On the last <select data-type="wL" value={gen[tab]['wL'][0]} onChange={actions.arg0}>
                            {everyOptions2}
                          </select> of the month
            </RadioOption>

            <RadioOption id="opt_nth_dow" name={tab} checked={gen[tab].type === 'w#'} 
                        data-type="wL" onChange={actions.type}>
              On the <select data-type="w#" value={gen[tab]['w#'][0]} onChange={actions.arg0}>
                       {everyOptions3}
                     </select> <select data-type="w#" value={gen[tab]['w#'][1]} onChange={actions.arg1}>
                       {everyOptions2}
                     </select> of the month
            </RadioOption>
                 
            <strong>*Weekday = Monday to Friday</strong>
          </>
        ) : (
          <>       
            <RadioOption id="opt_start" name={tab} checked={gen[tab].type === '/'} 
                        data-type="/" onChange={actions.type}>
              Every <select data-type="/" value={gen[tab]['/'][0]} onChange={actions.arg0}>
                      {everyOptions1}
                    </select> {tab}(s) starting at {tab} <select data-type="/" value={gen[tab]['/'][1]} onChange={actions.arg1}>
                                                          {everyOptions2}
                                                        </select>
            </RadioOption>
            
            <RadioOption id="opt_specific" name={tab} checked={gen[tab].type === ','} 
                        data-type="," onChange={actions.type}>
              Specific {tab}(s) (multiple selection): <ChecklistBox label={`Choose ${tab}`} options={specificOptions} maxShowSelection={10} 
                            data-type="," value={gen[tab][',']} onChange={actions.args}/>
            </RadioOption>
            
            <RadioOption id="opt_range" name={tab} checked={gen[tab].type === '-'} 
                        data-type="-" onChange={actions.type}>
              Every {tab} between <select data-type="-" value={gen[tab]['-'][0]}onChange={actions.arg0}>
                                    {everyOptions2}
                                  </select> and <select data-type="-" value={gen[tab]['-'][1]}onChange={actions.arg1}>
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