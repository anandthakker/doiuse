
module.exports =
  spy: ->
    results = []
    fn = ({feature,usage}) ->
      results.push
        feature: feature
        location: usage.source.start
        selector: usage.selector
        property: usage.property
        value: usage.value
    fn.results = results
    fn
