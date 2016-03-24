export default (storyId) => {
  window.onscroll = null;
  const xhr = new XMLHttpRequest();
  let storyData;
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
        document.body.scrollTop = 0;
        storyData = JSON.parse(xhr.responseText);
        document.getElementsByClassName('container')[0].innerHTML = storyData.body;
      }
    }
  };
  xhr.open('get', 'http://news-at.zhihu.com/api/4/news/' + storyId, true);
  xhr.send(null);
};
