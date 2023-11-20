let thread_list;

function test() {
  var url = "./data/dmc_to_rgb.json"
  fetch(url)
    .then((response) => response.json())
    .then((json) => {thread_list = json});
}

function selectThread(hexCode) {
  const hexVal = document.getElementsByName('hexCode')[0].value;
  const thread_colour = document.getElementById('colour_block');
  const thread_name = document.getElementById('colour_name');
  const chosen_rgb = toRGB(hexVal);
  let distance_table = [];

  //Calculate distance for all colours in the table
  distance_table = thread_list.map((thread) => {
    return calculate_distance(thread, chosen_rgb);
  });

  const closest = distance_table.reduce((previous_best, current) => {
    return previous_best.distance > current.distance
      ? current : previous_best;
  }, distance_table[0]);

  closest_thread = thread_list.find((thread) => thread.DMC == closest.id);
  thread_name.innerHTML = prettyName(closest_thread);
  thread_colour.style.backgroundColor = rgb_for_css(closest_thread);
}

function calculate_distance(thread, chosen_rgb){
  const id = getIdentifier(thread);
  const distance = getDistance(getRGB(thread), chosen_rgb);
  return { id : id, distance: distance};
}

function toRGB(hexVal){
  const code = hexVal.slice(1);
  const r = parseInt("0x" + code.slice(0,2));
  const g = parseInt("0x" + code.slice(2,4));
  const b = parseInt("0x" + code.slice(4,6));
  return [r,g,b];
}

function getDistance(thread_rgb, chosen_rgb){
  const r_distance = thread_rgb[0] - chosen_rgb[0];
  const g_distance = thread_rgb[1] - chosen_rgb[1];
  const b_distance = thread_rgb[2] - chosen_rgb[2];

  return Math.sqrt(r_distance**2 + g_distance**2 + b_distance**2);
}

function getRGB(thread){
  return [thread["Red"], thread["Green"], thread["Blue"]];
}

function getIdentifier(thread){
  return thread["DMC"];
}

function prettyName(thread){
  return "DMC:" + thread["DMC"] + " " + thread["Thread Colour Name"]
}

function rgb_for_css(thread){
  return "rgb(" + thread["Red"] + "," + thread["Green"] + "," + thread["Blue"] + ")";
}
