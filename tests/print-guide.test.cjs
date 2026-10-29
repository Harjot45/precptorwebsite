const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
test('each resource uses an independent printable preview rather than modal window.print',()=>{
 const code=read('app.js');
 assert.match(code,/href="print-guide\.html\?article=\$\{encodeURIComponent\(r\.id\)\}"/);
 assert.doesNotMatch(code,/data-print-article/);
});
test('print page includes print button, article mount and same source data',()=>{
 const html=read('print-guide.html');
 for(const id of ['print-button','print-article','return-to-guide'])assert.ok(html.includes(`id="${id}"`));
 assert.match(html,/src="data\.js"/);
 assert.match(html,/src="print-guide\.js"/);
 const js=read('print-guide.js');
 for(const part of ['guide.sections','guide.checklist','window.print()','pp-v3-guide-'])assert.ok(js.includes(part),part);
});
test('print stylesheet removes navigation and fits A4 PDF output',()=>{
 const css=read('print-guide.css');
 assert.match(css,/@page\s*\{size:A4/);
 assert.match(css,/@media print/);
 assert.match(css,/\.no-print,\.action-bar\{display:none!important\}/);
});
