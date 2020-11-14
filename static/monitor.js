new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  methods: {
    getTextColor(detail) {
      if (detail.textColor) {
        return detail.textColor + "--text"
      }
      return "black--text"
    }
  },
  filters: {
    addComma(value) {
      return value.toLocaleString()
    }
  },
  data: () => {
    return {
      sumOfAmount: 28800,
      date: "2020/10/18",
      fromTime: "20:00:00",
      toTime: "21:00:00",
      normalCount: 2434,
      superChatCount: 7,
      details: [
        {
          tier: 7,
          backgroundColor: '#e51717',
          textColor: "white",
          sumOfAmount: 20000,
          count: 2
        },
        {
          tier: 6,
          backgroundColor: '#e5177e',
          textColor: "white",
          sumOfAmount: 5000,
          count: 1
        },
        {
          tier: 5,
          backgroundColor: '#e57e17',
          sumOfAmount: 2000,
          count: 1
        },
        {
          tier: 4,
          backgroundColor: '#ffff80',
          sumOfAmount: 1000,
          count: 1
        },
        {
          tier: 3,
          backgroundColor: '#17e57e',
          sumOfAmount: 500,
          count: 1
        },
        {
          tier: 2,
          backgroundColor: '#80ffff',
          sumOfAmount: 200,
          count: 1
        },
        {
          tier: 1,
          backgroundColor: '#1717e5',
          textColor: "white",
          sumOfAmount: 100,
          count: 1
        },
      ]
    }
  },
})
