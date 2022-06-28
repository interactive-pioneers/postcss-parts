const postcss = require('postcss');
const fs = require('fs');

const plugin = require('./')

async function run (input, output, opts = { }) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

// Write tests here

it('gets critical', async () => {
  await run(
    fs.readFileSync('./testsource.css', {encoding:'utf8', flag:'r'}),
    fs.readFileSync('./testresult_critical.css', {encoding:'utf8', flag:'r'}),
    {parts: ['critical']}
  );
});

it('gets critical and essential', async () => {
  await run(
    fs.readFileSync('./testsource.css', {encoding:'utf8', flag:'r'}),
    fs.readFileSync('./testresult_critical_essential.css', {encoding:'utf8', flag:'r'}),
    {parts: ['essential','critical']}
  );
});

it('gets non-critical', async () => {
  await run(
    fs.readFileSync('./testsource.css', {encoding:'utf8', flag:'r'}),
    fs.readFileSync('./testresult_noncritical.css', {encoding:'utf8', flag:'r'}),
    {parts: ['noncritical']}
  );
});
