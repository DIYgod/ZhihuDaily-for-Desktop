import {Router} from 'director';
import routes from './routes';

// TODO: better import css
import './css/main.scss';

const router = Router(routes);

// TODO: extract listeners into module
// 后退前进按钮
document.getElementsByClassName('control-button')[0].addEventListener('click', () => {
    window.history.back();
});

document.getElementsByClassName('control-button')[1].addEventListener('click', () => {
    window.history.forward();
});

// TODO: deprecate global vars
window.globalData = {};

document.addEventListener('DOMContentLoaded', () => {
    router.init('/');
});
