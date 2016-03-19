const getNews = (data) => {
    const xhr = new XMLHttpRequest();
    let resNews;
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                resNews = JSON.parse(xhr.responseText);
                addNews(resNews);
            }
        }
    };
    if (data) {
        xhr.open('get', 'http://news-at.zhihu.com/api/4/news/before/' + data, true);
    }
    else {
        xhr.open('get', 'http://news-at.zhihu.com/api/4/news/latest', true);
    }
    xhr.send(null);
};

const addNews = (news) => {
    let newsHTML = `<div class="one-day ` + news.date + `"><h2>` + news.date + `</h2>`;
    let resNew;
    for (let i = 0; i < news.stories.length; i++) {
        newsHTML += `
            <a class="article-list" href="story.html?id=` + news.stories[i].id + `">
                <img class="article-img" src="` +  `img/default.png` + `">
                <div class="article-title">` + news.stories[i].title + `</div>
            </a>
        `
    }
    newsHTML += `</div>`;
    document.getElementsByClassName('container')[0].innerHTML += newsHTML;

    // 替换大图
    for (let i = 0; i < news.stories.length; i++) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                    resNew = JSON.parse(xhr.responseText);
                    document.getElementsByClassName(news.date)[0].getElementsByClassName('article-img')[i].src = resNew.image;
                }
            }
        };
        xhr.open('get', 'http://news-at.zhihu.com/api/4/news/' + news.stories[i].id, true);
        xhr.send(null);
    }
};

getNews();