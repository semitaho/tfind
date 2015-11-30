import TextFormatter  from '../../utils/textformatter.js';
import TestUtils  from 'react-addons-test-utils';

describe('tests text formatter', () => {
  it('make base test', () => {
    console.log('formatter', TextFormatter.formatToHTML);

    let originalText = 'koo\nkee';
    let formattedText = TextFormatter.formatToHTML(originalText);
    console.log('test', formattedText);
    expect(formattedText).toBe('koo<br />kee');
  });

  it('to format links', () => {
    

  });
});