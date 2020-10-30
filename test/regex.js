var postcss = require('postcss')

const test = require('tape');

const doiuse = require('../lib/doiuse');

test('no runaway regex', {timeout: 1000}, function(t) {
	t.timeoutAfter(1000);
	const cb = {warn: function(result) {
		t.equal(result, "CSS 2.1 selectors not supported by: IE (6) (css-sel2)");
	}};
	doiuse({ browsers: ['ie 6'] }).postcss(postcss.parse(".imagelightbox-arrow:focus:hover {}"), cb)
	t.end();
})
