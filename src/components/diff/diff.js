/// Based on
/// "An O(ND) Difference Algorithm and its Variations" by Eugene Myers
/// Algorithmica Vol. 1 No. 2, 1986, p 251.
///
/// Source: https://www.mathertel.de/Diff/ViewSrc.aspx

/**
 * details of one difference.
 * @param startA {number}
 * @param startB {number}
 * @param deletedA {number}
 * @param insertedB {number}
 * @returns {Item}
 * @constructor
 */
function Item(startA, startB, deletedA, insertedB) {
  this.startA = startA;
  this.startB = startB;
  this.deletedA = deletedA;
  this.insertedB = insertedB;
  return this;
}

/**
 * Shortest Middle Snake Return Data
 * @param x {number}
 * @param y {number}
 * @returns {SMSRD}
 * @constructor
 */
function SMSRD(x, y) {
  this.x = x;
  this.y = y;
  return this;
}

/**
 * Data on one input file being compared.
 * @param data
 * @returns {DiffData}
 * @constructor
 */
function DiffData(data) {
  this.length = data.length;
  this.data = data;
  this.modified = new Uint8Array(data.length + 2); // TODO: optimize by using bitmaps
  return this;
}

/**
 * Scan the tables of which lines are inserted and deleted,
 * producing an edit script in forward order.
 * @param dataA
 * @param dataB
 * @returns {Item[]}
 * @constructor
 */
function CreateDiffs(dataA, dataB) {
  const a = [];

  let startA = 0,
    startB = 0,
    lineA = 0,
    lineB = 0;

  while (lineA < dataA.length || lineB < dataB.length) {
    if (lineA < dataA.length && !dataA.modified[lineA]
      && lineB < dataB.length && !dataB.modified[lineB]) {
      // equal lines
      lineA++;
      lineB++;

    } else {
      // maybe deleted and/or inserted lines
      startA = lineA;
      startB = lineB;

      while (lineA < dataA.length && (lineB >= dataB.length || dataA.modified[lineA]))
        lineA++;

      while (lineB < dataB.length && (lineA >= dataA.length || dataB.modified[lineB]))
        lineB++;

      if ((startA < lineA) || (startB < lineB)) {
        // store a new difference-item

        a.push(new Item(startA, startB, lineA - startA, lineB - startB));
      }
    }
  }

  return a;
}

/**
 * This is the divide-and-conquer implementation of the longes common-subsequence (LCS)
 * algorithm.
 * The published algorithm passes recursively parts of the A and B sequences.
 * To avoid copying these arrays the lower and upper bounds are passed while the sequences stay constant.
 * @param dataA {DiffData}
 * @param lowerA {number}
 * @param upperA {number}
 * @param dataB {DiffData}
 * @param lowerB {number}
 * @param upperB {number}
 * @param downVector {Int32Array}
 * @param upVector {Int32Array}
 */
function LCS(dataA, lowerA, upperA, dataB, lowerB, upperB, downVector, upVector) {
  // Fast walkthrough equal lines at the start
  while (lowerA < upperA && lowerB < upperB && dataA.data[lowerA] === dataB.data[lowerB]) {
    lowerA++; lowerB++;
  }

  // Fast walkthrough equal lines at the end
  while (lowerA < upperA && lowerB < upperB && dataA.data[upperA - 1] === dataB.data[upperB - 1]) {
    --upperA; --upperB;
  }

  if (lowerA === upperA) {
    // mark as inserted lines.
    while (lowerB < upperB)
      dataB.modified[lowerB++] = true;

  } else if (lowerB === upperB) {
    // mark as deleted lines.
    while (lowerA < upperA)
      dataA.modified[lowerA++] = true;

  } else {
    // Find the middle snakea and length of an optimal path for A and B
    const smsrd = SMS(dataA, lowerA, upperA, dataB, lowerB, upperB, downVector, upVector);

    // The path is from LowerX to (x,y) and (x,y) to UpperX
    LCS(dataA, lowerA, smsrd.x, dataB, lowerB, smsrd.y, downVector, upVector);
    LCS(dataA, smsrd.x, upperA, dataB, smsrd.y, upperB, downVector, upVector);
  }
}

/**
 * This is the algorithm to find the Shortest Middle Snake (SMS).
 * @param dataA {DiffData}
 * @param lowerA {number}
 * @param upperA {number}
 * @param dataB {DiffData}
 * @param lowerB {number}
 * @param upperB {number}
 * @param downVector {Int32Array}
 * @param upVector {Int32Array}
 * @returns {SMSRD} a MiddleSnakeData record containing x,y
 */
function SMS(dataA, lowerA, upperA, dataB, lowerB, upperB, downVector, upVector) {

  const ret = new SMSRD(0, 0);
  const MAX = dataA.length + dataB.length + 1;

  const downK = lowerA - lowerB; // the k-line to start the forward search
  const upK = upperA - upperB; // the k-line to start the reverse search

  const delta = (upperA - lowerA) - (upperB - lowerB);
  const oddDelta = (delta & 1) !== 0;

  // The vectors in the publication accepts negative indexes. the vectors implemented here are 0-based
  // and are access using a specific offset: upOffset upVector and downOffset for downVector
  const downOffset = MAX - downK;
  const upOffset = MAX - upK;

  const maxD = ((upperA - lowerA + upperB - lowerB) / 2) + 1;

  // init vectors
  downVector[downOffset + downK + 1] = lowerA;
  upVector[upOffset + upK - 1] = upperA;

  for (let D = 0; D <= maxD; D++) {

    // Extend the forward path.
    for (let k = downK - D; k <= downK + D; k += 2) {

      // find the only or better starting point
      let x = 0, y = 0;
      if (k === downK - D) {
        x = downVector[downOffset + k + 1]; // down
      } else {
        x = downVector[downOffset + k - 1] + 1; // a step to the right
        if ((k < downK + D) && (downVector[downOffset + k + 1] >= x))
          x = downVector[downOffset + k + 1]; // down
      }
      y = x - k;

      // find the end of the furthest reaching forward D-path in diagonal k.
      while ((x < upperA) && (y < upperB) && (dataA.data[x] === dataB.data[y])) {
        x++; y++;
      }
      downVector[downOffset + k] = x;

      // overlap ?
      if (oddDelta && (upK - D < k) && (k < upK + D)) {
        if (upVector[upOffset + k] <= downVector[downOffset + k]) {
          ret.x = downVector[downOffset + k];
          ret.y = downVector[downOffset + k] - k;
          return (ret);
        }
      }

    }

    // Extend the reverse path.
    for (let k = upK - D; k <= upK + D; k += 2) {

      // find the only or better starting point
      let x = 0, y = 0;
      if (k === upK + D) {
        x = upVector[upOffset + k - 1]; // up
      } else {
        x = upVector[upOffset + k + 1] - 1; // left
        if ((k > upK - D) && (upVector[upOffset + k - 1] < x))
          x = upVector[upOffset + k - 1]; // up
      }
      y = x - k;

      while ((x > lowerA) && (y > lowerB) && (dataA.data[x - 1] == dataB.data[y - 1])) {
        x--; y--; // diagonal
      }
      upVector[upOffset + k] = x;

      // overlap ?
      if (!oddDelta && (downK - D <= k) && (k <= downK + D)) {
        if (upVector[upOffset + k] <= downVector[downOffset + k]) {
          ret.x = downVector[downOffset + k];
          ret.y = downVector[downOffset + k] - k;
          return (ret);
        }
      }

    }

  }

  throw new Error("the algorithm should never come here.");
}

/**
 * This function converts all textlines of the text into unique numbers for every unique textline
 * so further work can work only with simple numbers.
 * @param aText {string}
 * @param h {Object}
 * @param trimSpace {boolean}
 * @param ignoreSpace {boolean}
 * @param ignoreCase {boolean}
 * @returns {Int32Array}
 */
function diffCodes(aText, h, trimSpace, ignoreSpace, ignoreCase) {
  // get all codes of the text
  let lastUsedCode = Object.keys(h).length;

  // strip off all cr, only use lf as textline separator.
  aText = aText.replace(/\r/g, '');
  const lines = aText.split('\n');

  const codes = new Int32Array(lines.length);

  for (let i = 0; i < lines.length; ++i) {
    let s = lines[i];
    if (trimSpace)
      s = s.trim();

    if (ignoreSpace) {
      s = s.replace(/\s+/g, " "); // TODO: optimization: faster blank removal.
    }

    if (ignoreCase)
      s = s.toLowerCase();

    const aCode = h[s];
    if (!h.hasOwnProperty(aCode)) {
      lastUsedCode++;
      h[s] = lastUsedCode;
      codes[i] = lastUsedCode;
    } else {
      codes[i] = parseInt(aCode);
    }
  }
  return codes;
}

/**
 * Find the difference in 2 arrays of integers.
 * @param arrayA (number[]) A-version of the numbers (usualy the old one)
 * @param arrayB (number[]) B-version of the numbers (usualy the new one)
 * @returns {Item[]}
 */
function diffInt(arrayA, arrayB) {
  // The A-Version of the data (original data) to be compared.
  const dataA = new DiffData(arrayA);

  // The B-Version of the data (modified data) to be compared.
  const dataB = new DiffData(arrayB);

  const MAX = dataA.length + dataB.length + 1;
  /// vector for the (0,0) to (x,y) search
  const downVector = new Int32Array(2 * MAX + 2);
  /// vector for the (u,v) to (N,M) search
  const upVector = new Int32Array(2 * MAX + 2);

  LCS(dataA, 0, dataA.length, dataB, 0, dataB.length, downVector, upVector);
  return CreateDiffs(dataA, dataB);
}

/**
 * If a sequence of modified lines starts with a line that contains the same content
 * as the line that appends the changes, the difference sequence is modified so that the
 * appended line and not the starting line is marked as modified.
 * This leads to more readable diff sequences when comparing text files.
 * @param data {DiffData} A Diff data buffer containing the identified changes.
 */
function optimize(data) {
  let startPos = 0, endPos = 0;

  while (startPos < data.length) {
    while (startPos < data.length && !data.modified[startPos])
      startPos++;
    endPos = startPos;
    while (endPos < data.length && data.modified[endPos])
      endPos++;

    if (endPos < data.length && data.data[startPos] === data.data[endPos]) {
      data.modified[startPos] = 0;
      data.modified[endPos] = 1;
    } else {
      startPos = endPos;
    }
  }
}

/**
 * Find the difference in 2 text documents, comparing by textlines.
 * The algorithm itself is comparing 2 arrays of numbers so when comparing 2 text documents
 * each line is converted into a (hash) number. This hash-value is computed by storing all
 * textlines into a common hashtable so i can find dublicates in there, and generating a
 * new number each time a new textline is inserted.
 * @param textA {string}
 * @param textB {string}
 * @param trimSpace {boolean}
 * @param ignoreSpace {boolean}
 * @param ignoreCase {boolean}
 * @returns {Item[]}
 */
function diffText(textA, textB, trimSpace, ignoreSpace, ignoreCase) {
  // prepare the input-text and convert to comparable numbers.
  let h = {};

  // The A-Version of the data (original data) to be compared.
  const dataA = new DiffData(diffCodes(textA, h, trimSpace, ignoreSpace, ignoreCase));

  // The B-Version of the data (modified data) to be compared.
  const dataB = new DiffData(diffCodes(textB, h, trimSpace, ignoreSpace, ignoreCase));

  h = null; // free up hashtable memory (maybe)

  const MAX = dataA.length + dataB.length + 1;
  /// vector for the (0,0) to (x,y) search
  const downVector = new Int32Array(2 * MAX + 2);
  /// vector for the (u,v) to (N,M) search
  const upVector = new Int32Array(2 * MAX + 2);

  LCS(dataA, 0, dataA.length, dataB, 0, dataB.length, downVector, upVector);

  optimize(dataA);
  optimize(dataB);
  return CreateDiffs(dataA, dataB);
}

/*
export {
  diffText,
  diffInt
};
*/

function TestHelper(f) {
  let ret = '';
  for (let n = 0; n < f.length; n++) {
    ret += f[n].deletedA.toString() + "." + f[n].insertedB.toString() + "." + f[n].startA.toString() + "." + f[n].startB.toString() + "*";
  }
  return ret;
}





let a, b;

console.log("Diff Self Test...");

const myStrictEqual = (actual, expected, message) => {
  if (actual === expected) {
    console.log('PASS' + message);
  }
  else {
    console.error(message +  ', Actual: ' + actual + ', Expected: ' + expected);
  }
};

// test all changes
a = "a,b,c,d,e,f,g,h,i,j,k,l".replace(/,/g,'\n');
b = "0,1,2,3,4,5,6,7,8,9".replace(/,/g,'\n');
myStrictEqual(TestHelper(diffText(a, b, false, false, false))
  ,"12.10.0.0*",
  "all-changes test failed.");
//console.log("Assertion passed: all-changes test passed.");


// test all same
a = "a,b,c,d,e,f,g,h,i,j,k,l".replace(/,/g,'\n');
b = a;
myStrictEqual(TestHelper(diffText(a, b, false, false, false))
  ,"",
  "all-same test failed.");
//console.log("Assertion passed: all-same test passed.");


// test snake
a = "a,b,c,d,e,f".replace(/,/g,'\n');
b = "b,c,d,e,f,x".replace(/,/g,'\n');
myStrictEqual(TestHelper(diffText(a, b, false, false, false))
  ,"1.0.0.0*0.1.6.5*",
  "snake test failed.");
//console.log("Assertion passed: snake test passed.");

// 2002.09.20 - repro
a = "c1,a,c2,b,c,d,e,g,h,i,j,c3,k,l".replace(/,/g,'\n');
b = "C1,a,C2,b,c,d,e,I1,e,g,h,i,j,C3,k,I2,l".replace(/,/g,'\n');
myStrictEqual(TestHelper(diffText(a, b, false, false, false))
  ,"1.1.0.0*1.1.2.2*0.2.7.7*1.1.11.13*0.1.13.15*",
  "repro20020920 test failed.");
//console.log("Assertion passed: repro20020920 test passed.");


// 2003.02.07 - repro
a = "F".replace(/,/g,'\n');
b = "0,F,1,2,3,4,5,6,7".replace(/,/g,'\n');
myStrictEqual(TestHelper(diffText(a, b, false, false, false))
  ,"0.1.0.0*0.7.1.2*",
  "repro20030207 test failed.");
//console.log("Assertion passed: repro20030207 test passed.");


// Muegel - repro
a = "HELLO\nWORLD";
b = "\n\nhello\n\n\n\nworld\n";
myStrictEqual(TestHelper(diffText(a, b, false, false, false))
  , "2.8.0.0*",
  "repro20030409 test failed.");
//console.log("Assertion passed: repro20030409 test passed.");


// test some differences
a = "a,b,-,c,d,e,f,f".replace(/,/g,'\n');
b = "a,b,x,c,e,f".replace(/,/g,'\n');
myStrictEqual(TestHelper(diffText(a, b, false, false, false))
  ,"1.1.2.2*1.0.4.4*1.0.7.6*",
  "some-changes test failed.");
//console.log("Assertion passed: some-changes test passed.");

// test one change within long chain of repeats
a = "a,a,a,a,a,a,a,a,a,a".replace(/,/g,'\n');
b = "a,a,a,a,-,a,a,a,a,a".replace(/,/g,'\n');
myStrictEqual(TestHelper(diffText(a, b, false, false, false))
  ,"0.1.4.4*1.0.9.10*",
  "long chain of repeats test failed.");
//console.log("Assertion passed: long chain of repeats test passed.");

console.log("End.");