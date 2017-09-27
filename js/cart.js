new Vue({
  el: '#app',
  data: {
    totalMoney: 0,
    productList: [],
    checkAllFlag: false,
    delFlag: false,
    curProduct: ''
  },
  //局部过滤器
  filters: {
    formatMoney: function(value) {
      return "¥" + value.toFixed(2);
    }

  },
  mounted: function() {
    this.$nextTick(function() {
      this.cartView();
    })
  },
  methods: {
      cartView: function() {
        var _this = this;
        this.$http.get("data/cartData.json", {"id": 123}).then(function(res) {
          _this.productList = res.body.result.list;
          // _this.totalMoney =  res.body.result.totalMoney;
        });
      },
      //当商品数量增多或减少时，价钱相应的改变
      changeMoney: function(product, way) {
        if (way > 0) {
          product.productQuantity++;
        }
        else {
          product.productQuantity--;
          if (product.productQuantity < 1) {
            product.productQuantity = 1;
          }
        }
        this.calcTotalPrice();

      },
      //单选的样式改变
      selectedProduct: function(item) {
        if (typeof item.checked == 'undefined') {
          // Vue.set(item, "checked", true);
          this.$set(item, "checked", true);
        }
        else {
          item.checked = !item.checked;
        }
        this.calcTotalPrice();
      },
      //样式的全选
      checkAll: function(flag) {
        this.checkAllFlag = flag;
        var _this = this;
        this.productList.forEach(function (item, index) {
          if (typeof item.checked == 'undefined', _this.checkAllFlag) {
            _this.$set(item, "checked", _this.checkAllFlag);
          }
          else {
            item.checked = _this.checkAllFlag;
          }
        });
        this.calcTotalPrice();
      },
      //总价钱的计算
      calcTotalPrice: function() {
        var _this = this;
        this.totalMoney = 0;
        this.productList.forEach(function(item, index) {
          if (item.checked) {
            _this.totalMoney += item.productPrice * item.productQuantity;
          }
        });
      },
      //删除商品确认框
      delConfirm: function(item) {
        this.delFlag = true;
        this.curProduct = item;
      },
      //删除商品操作
      delProduct: function() {
        var index = this.productList.indexOf(this.curProduct);
        this.productList.splice(index, 1);
        this.delFlag = false;
      }
    }
});
// 全局过滤器
Vue.filter('money', function(value, type) {
  return "¥" + value.toFixed(2) + type;
})
