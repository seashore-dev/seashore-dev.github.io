function test() {
  console.log("This is working");
  var url = "./data/dmc_to_rgb.json"
  fetch(url)
    .then((response) => response.json())
    .then((json) => console.log(json));
}

function selectThread(hexCode) {
  var hexCode = document.getElementsByName('hexCode')[0].value
  console.log(hexCode);
}
