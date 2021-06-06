const unified = require('unified')
const markdown = require('remark-parse')
const remark2rehype = require('remark-rehype')
const highlight = require('rehype-highlight')
const html = require('rehype-stringify')

// import unified from "unified";
// import markdown from "remark-parse";
// import remark2rehype from "remark-rehype";
// import highlight from "rehype-highlight";
// import html from "rehype-stringify";



const processor = unified()
    // Transform markdown into a markdown syntax tree
    .use(markdown)
    // Transform markdown syntax tree to html syntax tree
    .use(remark2rehype)
    // Traverse html syntax tree to apply code highlighting to content within code tags
    .use(highlight)
    // Transform html syntax tree to string to send to the client
    .use(html)


export default async function syntaxHighlight(str: string) {
    return await processor.process(str);
}