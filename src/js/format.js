const UNITS = [
  {
    value: 1000 * 60 * 60 * 8 * 5,
    label: 'w'
  },
  {
    value: 1000 * 60 * 60 * 8,
    label: 'd'
  },
  {
    value: 1000 * 60 * 60,
    label: 'h'
  },
  {
    value: 1000 * 60,
    label: 'm'
  }
]

module.exports = function (task) {
  let total = task.totalTime + (task.isActive ? Date.now() - task.startTime : 0)

  const reduced = UNITS.reduce((acc, unit) => {
    const curr = Math.floor(acc.total / unit.value)

    if (curr) acc.results.push(curr + unit.label)

    acc.total -= (curr * unit.value)

    return acc
  }, {
    total,
    results: []
  })

  return reduced.results.length ? reduced.results.join(' ') : '0m'
}
