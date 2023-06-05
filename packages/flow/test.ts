import Flow from './src/index';

const formData = Flow({
  name: '',
  country: 'US',
});

const timezoneConfig = Flow(async () => {
  const { country } = formData.get();
  const res = await Promise.resolve({ country: country + '111' });
  console.log(res);
  return { res };
});

console.log(timezoneConfig);

formData.set({
  country: 'CN',
});