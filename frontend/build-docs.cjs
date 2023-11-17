const asciidoctor = require('asciidoctor')();
const fs = require('fs');
const glob = require('glob');
const path = require('path');

const adocFiles = glob.sync("../docs/**/*.adoc");

adocFiles.forEach(adocFile => {
    const relativePath = path.relative('../docs', adocFile);
    const outputPath = `./dist/docs/${relativePath.replace('.adoc', '.html')}`;

    const adocContent = fs.readFileSync(adocFile, 'utf8');
    const markdownContent = asciidoctor.convert(adocContent, { safe: 'safe', standalone: true});

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, markdownContent, 'utf8');

    // images
    const imagesDir = path.join(path.dirname(outputPath), 'img');
    const images = adocContent.match(/image::(.*?)\[/g) || adocContent.match(/image:(.*?)\[/g); // check if there are any images (TODO: maybe check for other imports in the future)
    
    if (images && images.length > 0) {
        fs.mkdirSync(imagesDir, { recursive: true });
    
        images.forEach(image => {
            const imageNameMatch = image.match(/image::(.*?)\[/) || image.match(/image:(.*?)\[/);
    
            if (imageNameMatch) {
                const imagePath = path.join(path.dirname(adocFile), imageNameMatch[1]);
                const destinationPath = path.join(imagesDir, path.basename(imageNameMatch[1]));
    
                fs.copyFileSync(imagePath, destinationPath);
            }
        });
    }
});
