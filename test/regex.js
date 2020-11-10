const test = require('tape')
const safe = require('safe-regex')
const features = require('../data/features')

regexes = []

for (var feature of Object.values(features)) {
	for (var property of Object.values(feature)) {
		if (!property || !(property instanceof Array)){
			continue;
		}

		for (var item of property) {
		  if (item instanceof RegExp) {
			  regexes.push(item)
		  }
		}
	}
}

for (var regex of regexes) {
	test('Regex safety check: /' + regex.source + '/', function(t) {
		t.ok(safe(regex))
		t.end()
	})
}
