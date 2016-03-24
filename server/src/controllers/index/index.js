import React from 'react';
import ReactDOM from 'react-dom/server';

// TODO: need to be refactored

export default () => {
    document.getElementsByClassName('container')[0].innerHTML = '';

    // 解析日期
    const parseDate = (date) => {
        return date.slice(4, 6) + '月' + date.slice(6, 8) + '日';
    };

    // 获取某一天的文章列表
    let indexDate;
    const getNews = (data) => {
        const xhr = new XMLHttpRequest();
        let resNews;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                    resNews = JSON.parse(xhr.responseText);
                    data ? addNews(resNews) : addNews(resNews, 'today');
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

    // 添加某一天的文章
    const addNews = (news, type) => {
        const {stories, date} = news;
        const newsHTML = (
            <div className={`one-day ${news.date}`}>
                <h2>{(type === 'today' ? `今日热闻` : parseDate(news.date))}</h2>
                {stories.map((story, i) => (
                    <a className="article-list" href={`#story/${story.id}`} key={i}>
                        <img className="article-img" src={'assets/img/default.png'}/>
                        <div className="article-title">{story.title}</div>
                        <div className="article-like">
                            <i className="fa fa-heart-o"/>
                            <span className="like-count">0</span>
                        </div>
                    </a>
                ))}
            </div>
        );
        indexDate = date;

        document.getElementsByClassName('container')[0].innerHTML += ReactDOM.renderToString(newsHTML);

        let resNew;

        // 替换大图
        for (let i = 0; i < stories.length; i++) {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                        resNew = JSON.parse(xhr.responseText);
                        document.getElementsByClassName(news.date)[0].getElementsByClassName('article-img')[i].src = resNew.image;
                        saveNews();
                    }
                }
            };
            xhr.open('get', 'http://news-at.zhihu.com/api/4/news/' + news.stories[i].id, true);
            xhr.send(null);
        }

        // 获取赞数
        for (let i = 0; i < stories.length; i++) {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                        resNew = JSON.parse(xhr.responseText);
                        document.getElementsByClassName(news.date)[0].getElementsByClassName('like-count')[i].innerHTML = resNew.popularity;
                        saveNews();
                    }
                }
            };
            xhr.open('get', 'http://news-at.zhihu.com/api/4/story-extra/' + news.stories[i].id, true);
            xhr.send(null);
        }
    };

    // 保存已加载的文章列表
    const saveNews = () => {
        window.globalData.indexDate = indexDate;
        window.globalData.newsHTML = document.getElementsByClassName('container')[0].innerHTML;
    };

    // 优先恢复已保存的文章列表
    if (window.globalData.indexDate && window.globalData.newsHTML) {
        indexDate = window.globalData.indexDate;
        document.getElementsByClassName('container')[0].innerHTML = window.globalData.newsHTML;
    }
    else {
        getNews();
    }
    window.onscroll = () => {
        if (window.innerHeight + document.body.scrollTop >= document.body.scrollHeight) {
            getNews(indexDate);
        }
    };
};
