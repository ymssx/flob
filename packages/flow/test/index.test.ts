import Flob from '../src/index';

describe('main', () => {
  it('111', async () => {
    const formData = Flob({
      name: '',
      country: 'US',
    });
    
    const timezoneConfig = Flob(async () => {
      const { country } = formData.get();
      const res = await Promise.resolve({ country: country + '111' });
      return { ...res };
    });
    
    formData.set({
      country: 'CN',
    });

    expect(await timezoneConfig.get()).toEqual({
      country: 'CN111',
    });
  });
});
