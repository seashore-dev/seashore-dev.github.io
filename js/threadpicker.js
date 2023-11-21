let threadList;
const url = './data/dmc_to_rgb.json';

function toRGB(hexVal) {
  const code = hexVal.slice(1);
  const red = code.slice(0, 2);
  const green = code.slice(2, 4);
  const blue = code.slice(4, 6);
  const r = parseInt(`0x${red}`, 16);
  const g = parseInt(`0x${green}`, 16);
  const b = parseInt(`0x${blue}`, 16);
  return [r, g, b];
}

function getIdentifier(thread) {
  return thread.DMC;
}

function getDistance(threadRGB, chosenRGB) {
  const rDistance = threadRGB[0] - chosenRGB[0];
  const gDistance = threadRGB[1] - chosenRGB[1];
  const bDistance = threadRGB[2] - chosenRGB[2];

  return Math.sqrt(rDistance ** 2 + gDistance ** 2 + bDistance ** 2);
}

function getRGB(thread) {
  return [thread.Red, thread.Green, thread.Blue];
}

function calculateDistance(thread, chosenRGB) {
  const id = getIdentifier(thread);
  const distance = getDistance(getRGB(thread), chosenRGB);
  return { id, distance };
}

function prettyName(thread) {
  return `DMC: ${thread.DMC} ${thread['Thread Colour Name']}`;
}

function rgbForCSS(thread) {
  return `rgb(${thread.Red}, ${thread.Green}, ${thread.Blue})`;
}

function selectThread() {
  const hexVal = document.getElementById('hex_code').value;
  const threadColour = document.getElementById('colour_block');
  const threadName = document.getElementById('colour_name');
  const chosenRGB = toRGB(hexVal);
  let distanceTable = [];

  // Calculate distance for all colours in the table
  distanceTable = threadList.map((thread) => calculateDistance(thread, chosenRGB));

  const closest = distanceTable.reduce(
    (previousBest, current) => {
      if (previousBest.distance > current.distance) {
        return current;
      }
      return previousBest;
    },
    distanceTable[0],
  );

  const closestThread = threadList.find((thread) => thread.DMC === closest.id);
  threadName.innerHTML = prettyName(closestThread);
  threadColour.style.backgroundColor = rgbForCSS(closestThread);
}

fetch(url)
  .then((response) => response.json())
  .then((json) => { threadList = json; });

window.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('find_thread');
  if (el) {
    el.addEventListener('click', selectThread, false);
  }
});
