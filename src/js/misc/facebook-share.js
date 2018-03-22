export const fbShare = (url, title, descr, winWidth, winHeight) => {
  const winTop = (screen.height / 2) - (winHeight / 2);
  const winLeft = (screen.width / 2) - (winWidth / 2);
  window.open(`https://www.facebook.com/sharer.php?s=100&p[title]=${title}&p[summary]=${descr}&p[url]=${url}&sharer`,
    `top=${winTop},left=${winLeft},toolbar=0,status=0,width=${winWidth},height=${winHeight}`);
};

export default { fbShare };
