Vue.component('calculator-output', {
	props: ['expression', 'result', 'tweenExpression', 'calculated'],
	template: `<div class="output-container">
		  <div class="output-up"><span v-if="calculated">{{expression}}</span></div>
		  <div class="output-down"><span v-if="!calculated">{{expression}}</span><span v-else>={{result}}</span></div>
		</div>`
});

Vue.component('calculator-button', {
	props: ['buttonArr'],
	template: `<div class="button-container" >
		    <button  :class="index < 5 ? 'special' : 'normal'"  v-for="(item,index) in buttonArr" :key="index" :value="item" @click="$emit('assign',$event,item)">{{item}}</button>
		  </div>
		  `
});

var vm = new Vue({
	el: '#app',
	data: {
		buttonArr: ['back', '(', ')', '%', 'C', '7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=',
			'+'
		],
		expression: '', //保存算式
		result: null, //保存计算结果
		calculated: false //表示计算是否完成,true为未完成,false为完成

	},
	computed: {
		lastChar: function() {
			return this.expression.charAt(this.expression.length - 1);
		}
	},
	methods: {
		assign: function (event, item) { //根据点击的按钮,调用特定的函数
			switch (item) {
				case '0':
					this.checkZero(event);
					break;
				case '1':
				case '2':
				case '3':
				case '4':
				case '5':
				case '6':
				case '7':
				case '8':
				case '9':
					this.checkNum(event, item);
					break;
				case 'C':
					this.clear();
					break;
				case '+':
				case '-':
				case '/':
				case '*':
				case '.':
					this.checkOperator(event, item);
					break;
				case 'back':
					this.back();
					break;
				case '%':
					this.turnFloat();
					break;
				case '=':
					this.calculate();
					break;
				default:
					this.expression += item;
			}
		},
		deleteLastChar: function () {  //删除表达式最后一位字符
			return this.expression.substring(0, this.expression.length - 1);
		},
		back: function () { //对应back键,删除算式的最后一位
			vm.expression == '' ? vm.clear() : vm.expression = vm.deleteLastChar(); //当删到算式为空时,调用clear(),相当于按了一次'C'键 : 如果算式不为空,则删掉其最后一位的字符
		},
		clear: function () { //对应C键,清空保存算式和结果的属性,并把表示计算是否结束的属性设为false
			vm.expression = vm.result = '';
			vm.calculated = false;
		},
		checkOperator: function (event, item) { //对应+-*/.键  
			var reg = /[\+\-\*\/\.]/;
			if (item === '-') {
			   return vm.expression += item;
			};
			if (!reg.test(vm.lastChar)) { //如果算式最后一位已经是运算符或算式为空且点击的键不是-,则阻止本次操作
				vm.expression += item;
			};
		},
		checkZero: function (event) { //对应0键		
			vm.expression == '0' ? event.preventDefault() : vm.expression += '0'; //如果算式只有一个0,则阻止本次操作
		},
		checkNum: function (item) { //对应1-9键
			vm.expression == '0' ? (vm.expression = '', vm.expression += item) : vm.expression += item; //如果当前算式只有一个0,则删除这个0再将数字拼入算式
		},
		turnFloat: function () { //对应%,将数字转化为它*0.01后的结果
			if (!parseInt(vm.lastChar)) { //当最后一位字符不是数字时,不执行函数
				return;
			}
			var i = vm.expression.length - 1;
			var reg = /[0-9\.]/;
			do {
				var char = vm.expression.charAt(i);
				i--;

			} while (reg.test(char));
			var num = parseFloat(vm.expression.substring(i + 2));
			vm.expression = vm.expression.substring(0, i + 2);
			var floatNum = num * 0.01;
			vm.expression += floatNum.toString();

		},
		calculate: function () { //对应=
			try {
				if (vm.expression == '') {
					return;
				}
				var reg = /[0-9\)]/;
				if (!reg.test(vm.lastChar)) { //如果算式的最后一位不是数字或右括号,则删除最后一位字符直到遇到数字或右括号为止
					do {
						vm.expression = vm.deleteLastChar();
					} while (!reg.test(vm.lastChar));
				}
				vm.calculated = true;
				vm.result = eval(vm.expression) + '';
			} catch (e) {
				alert('您输入的算式有误');

			}
		}
	},


})
