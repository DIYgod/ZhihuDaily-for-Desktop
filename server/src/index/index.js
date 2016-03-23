// TODO: need to be refactored

module.exports = () => {
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
    let newsHTML = `<div class="one-day ` + news.date + `"><h2>` + (type === 'today' ? `今日热闻` : parseDate(news.date)) + `</h2>`;
    let resNew;
    for (let i = 0; i < news.stories.length; i++) {
      newsHTML += `
            <a class="article-list" href="#story/` + news.stories[i].id + `">
                <img class="article-img" src="` + `assets/img/default.png` + `">
                <div class="article-title">` + news.stories[i].title + `</div>
                <div class="article-like"><i class="fa fa-heart-o"></i><span class="like-count">0</span></div>
            </a>
        `
    }
    newsHTML += `</div>`;
    document.getElementsByClassName('container')[0].innerHTML += newsHTML;
    indexDate = news.date;

    // 替换大图
    for (let i = 0; i < news.stories.length; i++) {
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
    for (let i = 0; i < news.stories.length; i++) {
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
