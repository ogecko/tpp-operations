// Store markers outside of the function scope,
// not to recreate them on every call
const code2char = {
  'amp': '&',
  'apos': '\'',
  '#x2019': '\'',
  '#8217': '\'',
  'lt': '<',
  'gt': '>',
  'quot': '"',
  'nbsp': '\xa0'
};
const entityPattern = /&([a-z#0-9]+);/ig;

export function unescapeHtml(text) {
  // A single replace pass with a static RegExp is faster than a loop
  return text.replace(entityPattern, function(match, entity) {
    const code = entity.toLowerCase();

    // replace any html escaped characters &amp; &apos; &lt; &gt; &quot; &nbsp;
    if (code2char.hasOwnProperty(code)) {
      return code2char[code];
    }

    // convert any html encoded unicode to actual unicode character
    if (code.match(/^#x.{3,4}$/)) {
      code[0] = '0';    // from &#x2764; to ❤
      return '';        // doesnt work with Blaze - String.fromCharCode(code)
    }


    // return original string if there is no matching entity (no replace)
    return match;
  });
};