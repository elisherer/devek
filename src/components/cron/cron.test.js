 Cron from './cron';

describe('cron', () => {

  test('parse second every', () => {
    const parsed = Cron.parse('* 0 12 ? JAN,JUN * *');

    expect(parsed.second).toEqual({ type: '*' });
  });
  test('parse second start', () => {
    const parsed = Cron.parse('5/5 0 12 ? JAN,JUN * *');

    expect(parsed.second).toEqual({ type: '/', args: [5, 5] });
  });
  test('parse second start *', () => {
    const parsed = Cron.parse('*/5 0 12 ? JAN,JUN * *');

    expect(parsed.second).toEqual({ type: '/', args: [0, 5] });
  });
  test('parse second specific', () => {
    const parsed = Cron.parse('0 0 12 ? JAN,JUN * *');

    expect(parsed.second).toEqual({ type: ',', args: [0] });
  });
});