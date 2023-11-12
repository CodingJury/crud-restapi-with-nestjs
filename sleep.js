//THIS SCRIPT IS USED BY "package.json"

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const args = process.argv.slice(2); //! [0:node, 1:sleep.js, 2: 3000]  we want the time in ms
  const sleepDuration = args[0] || 5000; //Default to 5000ms if no argument is provided

  console.log(`--->Going to sleep for ${sleepDuration/1000} seconds`)
  await sleep(sleepDuration);
  console.log(`--->I woke up`)
}

main();