//THIS SCRIPT IS USED BY "package.json"

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const args = process.argv.slice(2); //! [0:node, 1:sleep.js, 2: 3000ms]  we want the time in ms
  let sleepDuration = 5000; //Default to 5000ms if no argument is provided
  if(args[0].endsWith("ms")) {
    sleepDuration = parseInt(args[0],10); //Base 10 number system
  }

  console.log(`--->Going to sleep for ${sleepDuration} milliseconds`)
  await sleep(sleepDuration);
  console.log(`--->I woke up`)
}

main();