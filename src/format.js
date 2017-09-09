const MINUTE = 60000
const HOUR = MINUTE * 60
const DAY = HOUR * 8
const WEEK = DAY * 5
const UNITS = [
  {
    value: WEEK,
    label: 'w'
  },
  {
    value: DAY,
    label: 'd'
  },
  {
    value: HOUR,
    label: 'h'
  },
  {
    value: MINUTE,
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
