const [, version] = (/^Release (\d+\.\d+\.\d+[a-z0-9-]*)/ig).exec(process.argv[2]) || Array(2).fill(null);

console.log(version);
