// modified from https://searchfox.org/mozilla-central/source/intl/l10n/L10nRegistry.jsm
// removed option for 'flipped' to test RTL

const ACCENTED_MAP = {
  // ȦƁƇḒḖƑƓĦĪĴĶĿḾȠǾƤɊŘŞŦŬṼẆẊẎẐ
  caps: [
    550,
    385,
    391,
    7698,
    7702,
    401,
    403,
    294,
    298,
    308,
    310,
    319,
    7742,
    544,
    510,
    420,
    586,
    344,
    350,
    358,
    364,
    7804,
    7814,
    7818,
    7822,
    7824
  ],
  // ȧƀƈḓḗƒɠħīĵķŀḿƞǿƥɋřşŧŭṽẇẋẏẑ
  small: [
    551,
    384,
    392,
    7699,
    7703,
    402,
    608,
    295,
    299,
    309,
    311,
    320,
    7743,
    414,
    511,
    421,
    587,
    345,
    351,
    359,
    365,
    7805,
    7815,
    7819,
    7823,
    7825
  ]
};

export function pseudolocalize(msg) {
  // Exclude access-keys and other single-char messages
  if (msg.length === 1) {
    return msg;
  }
  // XML entities (&#x202a;) and XML tags.
  const reExcluded = /(&[#\w]+;|<\s*.+?\s*>)/;

  const parts = msg.split(reExcluded);
  const modified = parts.map((part) => {
    if (reExcluded.test(part)) {
      return part;
    }
    return part.replace(/[a-z]/gi, (ch) => {
      const cc = ch.charCodeAt(0);
      if (cc >= 97 && cc <= 122) {
        const newChar = String.fromCodePoint(ACCENTED_MAP.small[cc - 97]);
        // duplicate "a", "e", "o" and "u" to emulate ~30% longer text
        if (cc === 97 || cc === 101 || cc === 111 || cc === 117) {
          return newChar + newChar;
        }
        return newChar;
      }
      if (cc >= 65 && cc <= 90) {
        return String.fromCodePoint(ACCENTED_MAP.caps[cc - 65]);
      }
      return ch;
    });
  });
  return modified.join('');
}
