const ITERATIONS = 10000;
const CHARSET = "abcdefghijklmnopqrstuvwxyz";
const MIN_N = 2;
const MAX_N = 50;
const WORDS = 50;
const REGEX = /([a-z])(?=[a-z]*\1)/g

function randomString(anysize) {
  result = "";
  for (let i = 0; i < anysize; ++i)
    result += CHARSET[Math.floor(Math.random() * CHARSET.length)];

  return result;
}

function doubleFor(word) {
  let multiples = 0;

  for (let i = 0; i < word.length; ++i) {
    for (let j = 0; j < word.length; ++j) {
      if (word[i] == word[j]) {
        if (j < i) {
          break;
        }
        else if (j > i) {
          ++multiples;
        }
      }
    }
  }

  return multiples;
}

function countMap(word) {
  let counts = {};

  for (let c of word) {
    if (counts[c] != null)
      ++counts[c];
    else
      counts[c] = 1;
  }

  let multiples = 0;
  for (let c in counts) {
    if (counts[c] > 1)
      ++multiples;
  }

  return multiples;
}

function countSort(word) {
  let sortedWord = word.split("").sort();

  let multiples = 0;
  let lastChar;
  let alreadyCounted = false;
  for (let c of sortedWord) {
    if (lastChar === undefined) {
      lastChar = c;
      continue;
    }

    if (c == lastChar) {
      if (!alreadyCounted) {
        alreadyCounted = true;
        ++multiples;
        continue;
      }
    }

    alreadyCounted = false;
    lastChar = c;
  }

  return multiples;
}

function countRegex(word) {
  return (word.match(REGEX) || []).length;
}

function testApproach(words, func, iterations) {
  let t0 = Date.now();

  for (let i = 0; i < iterations; ++i)
    for (let w of words)
      func(w);

  return Date.now() - t0;
}

function test(minN, maxN, wordCount, iterations, approaches) {
  let results = [];

  for (let n = minN; n <= maxN; ++n) {
    let result = { n };

    console.error(` Testing with word length ${n}`);

    let words = [];
    for (let i = 0; i < wordCount; ++i) {
      words.push(randomString(n));
    }

    for (let k in approaches) {
      result[k] = testApproach(words, approaches[k], iterations);
    }

    results.push(result);
  }

  return results;
}

function padString(string, length) {
  let paddedString = "" + string;
  while(paddedString.length < length) {
    paddedString += " ";
  }

  return paddedString;
}

function printResults(headings, results) {
  let maxLengths = {};

  for (let k in headings) {
    maxLengths[k] = headings[k].length;

    for (let r of results) {
      let c = r[headings[k]];

      let stringLength = `${c}`.length;
      if (stringLength > maxLengths[k]) {
        maxLengths[k] = stringLength;
      }
    }
  }

  let topLine = "╔";
  let bottomLine = "╚";
  let separatorLine = "╠";
  let maxLengthsKeys = Object.keys(maxLengths);
  for (let j = 0; j < maxLengthsKeys.length; j++) {
    let k = maxLengthsKeys[j];

    for (let i = 0; i < maxLengths[k] + 2; i++) {
      topLine += "═";
      bottomLine += "═";
      separatorLine += "═";
    }

    if (j < maxLengthsKeys.length - 1) {
      topLine += "╦";
      bottomLine += "╩";
      separatorLine += "╬";
    }
  }

  topLine += "╗";
  bottomLine += "╝";
  separatorLine += "╣";

  let headingLine = "║"
  for (let k in headings) {
    headingLine += ` ${padString(headings[k], maxLengths[k])} ║`;
  }
  console.log(topLine);
  console.log(headingLine);
  console.log(separatorLine);
  for (let i = 0; i < results.length; i++) {
    let r = results[i];

    let resultLine = "║"
    for (let k in headings) {
      resultLine += ` ${padString(r[k], maxLengths[k])} ║`;
    }
    console.log(resultLine);

    if (i < results.length - 1)
      console.log(separatorLine);
  }

  console.log(bottomLine);
}

function printResultsCsv(headings, results) {
  let headingLine = "";
  for (let k in headings) {
    headingLine += `${headings[k]};`;
  }
  console.log(headingLine);

  for (let r of results) {
    let resultLine = "";
    for (let k in r) {
      resultLine += `${r[k]};`;
    }

    console.log(resultLine);
  }
}

let results = test(MIN_N, MAX_N, WORDS, ITERATIONS, {
  doubleFor,
  countMap,
  countSort,
  countRegex
});

const headings = {
  "n": "n",
  "doubleFor": "Double for (ms)",
  "countMap": "Count map (ms)",
  "countSort": "Count sort (ms)",
  "countRegex": "Count regex (ms)"
};

if (process.argv[process.argv.length -1] == "csv") {
  printResultsCsv(headings, results);
}
else {
  printResults(headings, results);
}
