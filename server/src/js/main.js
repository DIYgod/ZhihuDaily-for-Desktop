const xhr = new XMLHttpRequest();
let latest = null;
xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
            latest = JSON.parse(xhr.responseText);
        }
        else {
            console.log('Request was unsuccessful: ' + xhr.status);
        }
    }
};
xhr.open('get', 'http://news-at.zhihu.com/api/4/news/latest', true);
xhr.send(null);