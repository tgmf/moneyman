import Vue from 'vue'

Vue.filter('toCurrency', function (value) {
    if (typeof value !== 'number') {
      return value
    }
    var formatter = new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
    return formatter.format(value)
  })