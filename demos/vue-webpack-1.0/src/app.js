require('assets/css/app.css');
require('assets/libs/flexible-v2');
import Vue from 'vue';
import Zepto from 'assets/libs/zepto';
window.$ = window.Zepto = Zepto;
// import aladdin from 'aladdin-ibank';
import PEC from 'assets/libs/pec.min';
window.PEC = PEC;
require('assets/libs/fastclick');
require('assets/libs/auth-sdk.min');

var env = require('env');
console.log('env:')
console.log(env);
// window.aladdin = aladdin;

window.App = {
	EventVue: new Vue()
};
