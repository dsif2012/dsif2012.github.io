console.log("github_api loaded");

// GitHub API 優化版本
class GitHubAPI {
  constructor() {
    this.repos = [];
    this.requestQueue = [];
    this.activeRequests = 0;
    this.maxConcurrentRequests = 3; // 限制同時請求數量
    this.retryLimit = 3;
    this.retryDelay = 1000; // 1秒
    this.cache = new Map(); // 本地緩存
    this.cacheExpiry = 10 * 60 * 1000; // 10分鐘緩存
  }

  // 初始化並收集所有repo信息
  init() {
    $(".ghbtn").each((index, element) => {
      const $element = $(element);
      const user = $element.attr('user');
      const repo = $element.attr('repo');
      if (user && repo) {
        this.repos.push({
          fullName: `${user}/${repo}`,
          repoName: repo,
          element: $element
        });
      }
    });

    // 清理過期緩存
    this.cleanExpiredCache();

    // 定期清理緩存（每5分鐘）
    setInterval(() => {
      this.cleanExpiredCache();
    }, 5 * 60 * 1000);

    // 開始處理請求隊列
    this.processQueue();
  }

  // 處理請求隊列
  processQueue() {
    this.repos.forEach(repoInfo => {
      this.requestQueue.push(() => this.fetchRepoData(repoInfo));
    });

    this.executeNext();
  }

  // 執行下一個請求
  executeNext() {
    if (this.activeRequests >= this.maxConcurrentRequests || this.requestQueue.length === 0) {
      return;
    }

    this.activeRequests++;
    const nextRequest = this.requestQueue.shift();
    nextRequest();
  }

  // 獲取單個repo數據
  async fetchRepoData(repoInfo, tryCount = 0) {
    try {
      // 檢查緩存
      const cachedData = this.getFromCache(repoInfo.fullName);
      if (cachedData) {
        this.updateRepoUI(repoInfo, cachedData);
        this.activeRequests--;
        this.executeNext();
        return;
      }

      // 添加loading狀態
      this.setLoadingState(repoInfo.element, true);

      const response = await $.ajax({
        type: "GET",
        url: `https://api.github.com/repos/${repoInfo.fullName}`,
        dataType: "json",
        timeout: 10000 // 10秒超時
      });

      // 緩存響應數據
      this.saveToCache(repoInfo.fullName, response);
      this.updateRepoUI(repoInfo, response);
      
    } catch (error) {
      console.warn(`Failed to fetch ${repoInfo.fullName}:`, error);
      
      // 重試邏輯
      if (tryCount < this.retryLimit) {
        setTimeout(() => {
          this.fetchRepoData(repoInfo, tryCount + 1);
        }, this.retryDelay * (tryCount + 1)); // 漸進式延遲
      } else {
        this.setErrorState(repoInfo.element);
      }
    } finally {
      this.activeRequests--;
      this.setLoadingState(repoInfo.element, false);
      this.executeNext(); // 繼續處理隊列
    }
  }

  // 更新UI顯示
  updateRepoUI(repoInfo, data) {
    const $element = repoInfo.element;
    const repoName = repoInfo.repoName;

    // 更新統計數據
    $element.find("span.star").html(`&nbsp;${this.formatNumber(data.stargazers_count)}`);
    $element.find("span.fork").html(`&nbsp;${this.formatNumber(data.forks_count)}`);
    $element.find("span.watchers").html(`&nbsp;${this.formatNumber(data.watchers_count)}`);
    
    // 更新描述
    $(`div[repotext='${repoName}']`).find("span.desc").html(data.description || '無描述');
  }

  // 設置loading狀態 - 簡化版本
  setLoadingState(element, isLoading) {
    if (isLoading) {
      element.find("span.star, span.fork, span.watchers").html('&nbsp;...');
    }
  }

  // 設置錯誤狀態
  setErrorState(element) {
    element.find("span.star, span.fork, span.watchers").html('&nbsp;--');
  }

  // 格式化數字（如 1000 -> 1k）
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }

  // 緩存相關方法
  saveToCache(key, data) {
    this.cache.set(key, {
      data: data,
      timestamp: Date.now()
    });
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
      return cached.data;
    }
    // 過期的緩存項目將被移除
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  // 清理過期緩存
  cleanExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp >= this.cacheExpiry) {
        this.cache.delete(key);
      }
    }
  }
}

// 當文檔準備好時初始化
$(document).ready(function() {
  const githubAPI = new GitHubAPI();
  let isProjectsLoaded = false;
  
  // 懶加載優化：只有當切換到projects頁面時才開始加載
  function initGitHubAPIIfNeeded() {
    if (!isProjectsLoaded && window.location.hash === '#projects') {
      isProjectsLoaded = true;
      // 延遲初始化，避免阻塞頁面渲染
      setTimeout(() => {
        githubAPI.init();
      }, 300);
    }
  }
  
  // 監聽hash變化
  window.addEventListener('hashchange', initGitHubAPIIfNeeded);
  
  // 初始檢查
  initGitHubAPIIfNeeded();
});
