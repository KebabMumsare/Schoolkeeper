import fs from 'fs';
import archiver from 'archiver';

export function createZip(fileNames) {
const output = fs.createWriteStream(__dirname + '/archive.zip');
const archive = archiver('zip', {
    zlib: { level: 9 }
});

output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function(err){
    throw err;
});

archive.pipe(output);

for (const fileName of fileNames) {
    const file = fs.createReadStream(fileName);
    archive.append(file, { name: fileName });
}

archive.finalize();
}