const path = require('path');
const json2md = require("json2md")
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const chalk = require('chalk');

 async function getHtml(url) {
    const { data: html } = await axios.get(url);
    return html;
}

async function generateMarkdown(data) {
    const heading = `---\ntitle: ${data.name}\nthumbnail: '${data.imgSrc}'\n---\n\n`;

    const md = await json2md([
        {
            h1: data.name
        },
        {
            link: {
                title: data.name,
                source: data.link,
            }
        },
        {
            img: {
                title: data.name,
                source: data.imgSrc,
            }
        }
    ]);

    return `${heading}${md}`;
}

async function getWigs(html) {

    // Load the HTML as a cheerio instance
    const $ = cheerio.load(html);
    
    // Find the products list elements
    const wigSpan = $('.products li');

    // We want to make a new directory for our markdown files to live
    const directory = path.join('.', 'wig-pages');
    await fs.mkdirs(directory);

    // Loop through wigs and get data
    for (let i = 0; i < wigSpan.length; i++) {
        
        // Giving ourselves a little feedback about the process
        console.log(`Getting ${i} of ${wigSpan.length - 1}`);

        // Get the DOM elements we need
        const wigLinkSpan = $(wigSpan[i]).find('a')[0];
        const wigNameSpan = $(wigLinkSpan).find('h3')[0];

        // Get wig link and name data
        const wigLink = $(wigLinkSpan).attr('href');
        const wigName = $(wigNameSpan).text();

        // Get high-res photo from detail page
        const wigDetailsHtml = await getHtml(wigLink);
        const wigHtml = cheerio.load(wigDetailsHtml);
        const imgSrc = wigHtml('div.images > a > img').attr('src');

        // create markdown here
        const markdown = await generateMarkdown({
            name: wigName,
            link: wigLink,
            imgSrc,
        });

        const file = path.join('.', 'wig-pages', `${wigName.split(' ').join('-')}.md`);
        await fs.writeFile(file, markdown);
    }
}

async function go() {
    const url = process.argv[2];

    if (url === undefined) {
        console.log(chalk.white.bgRed.bold('Please provide a URL to scrape.'));
        console.log('Try something like:');
        console.log(chalk.green('node index.js https://www.hairuwear.com/raquel-welch/products-rw/signature-wig-collection-2/'));
        return;
    }

    const html = await getHtml(url);
    const data = await getWigs(html);
    const markdown = await generateMarkdown(data);
    console.log(data);
}

go();
