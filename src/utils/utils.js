const converSize = (limit) => {
  let size = "";
  if (limit < 0.1 * 1024) { //如果小于0.1KB转化成B
      size = limit.toFixed(2) + "B";
  } else if (limit < 0.1 * 1024 * 1024) {//如果小于0.1MB转化成KB
      size = (limit / 1024).toFixed(2) + "KB";
  } else if (limit < 0.1 * 1024 * 1024 * 1024) { //如果小于0.1GB转化成MB
      size = (limit / (1024 * 1024)).toFixed(2) + "MB";
  } else { //其他转化成GB
      size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
  }

  let sizestr = size + "";
  const len = sizestr.indexOf(".");
  const dec = sizestr.substr(len + 1, 2);
  if (dec === "00") {//当小数点后为00时 去掉小数部分
      return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
  }
  return sizestr;
}

const parseQueryParams = () => {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      var strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
        theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
      }
    }
    return theRequest;
}

export default {
  converSize,
  parseQueryParams 
};
