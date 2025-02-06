---
layout: post
title: "個人網頁建置"
date: 2025-02-06
excerpt: "這是個人網頁建置的過程"
image: "/images/back.jpg"
tags: 
  - projects
category: 技術
---

## 介紹
　　身為一名軟體工程師，GitHub幾乎是每個人都會使用的工具。然而，懶惰如我一直以來都不太願意花時間管理，在絞盡腦汁跟該死的bug奮鬥完，還要處理git等事情，也導致我的github一直都是一團亂。隨著時間的推移，快到30歲的我覺得是時候整理一下自己的作品了。因此，我決定利用這個機會，在GitHub Pages上建立一個個人網站，這篇文章將記錄我建置個人網頁的完整過程。

　　早在幾年前我就有看到相關文章，使用github.io來建立個人網站，但是當時我建完以後就放著了。直到最近，我覺得是時候整理一下自己的作品了，所以就打算重新建置個人網頁與整理我的github。問了一下chatgpt，發現現在github.io使用的技術還是jekyll還有沒用過的hugo。考慮到之前用過jekyll，所以就摸摸看hugo。不知道是啥問題，我選的theme一直安裝不起來，其他theme也沒有看到喜歡的，所以最後還是決定使用jekyll。

## 使用技術與工具
- Jekyll 靜態網站生成器
- GitHub Pages 託管
- Jekyll-Uno-Timeline 主題
- cursor
- Git

## 建置步驟

### 1. 環境準備
首先需要安裝必要的開發環境(windows平台)：
- Ruby 安裝 (使用[rubyinstaller](https://rubyinstaller.org/))
  - 安裝時記得勾選 "Add Ruby executables to your PATH"，這樣才能在命令提示字元使用 Ruby
  - 安裝完後開啟命令提示字元輸入 `ruby -v`，如果有顯示版本號就代表安裝成功了
- Git 安裝
  - 基本上就是一直下一步，除非你有特別的需求

### 2. 安裝 Jekyll 和 Bundler
```bash
gem install jekyll bundler
```
如果出現權限問題，就用系統管理員身分開啟命令提示字元再試一次。

### 3. 創建 Jekyll 網站
```bash
jekyll new myblog
cd myblog
```
這時候會建立一個基本的 Jekyll 網站，但說實在預設的樣式真的不怎麼樣，所以要換個好看點的主題。

### 4. 更換主題
我選的是 Jekyll-Uno-Timeline 這個主題，主要是因為它比較符合我的審美。
1. 先把原本的檔案備份一下（以防萬一）
2. 下載主題：
   ```bash
   git clone https://github.com/tzuehlke/jekyll-uno-timeline.git
   ```
3. 把下載的主題檔案複製到你的網站目錄
4. 安裝主題需要的套件：
   ```bash
   bundle install
   ```

### 5. 使用 cursor 修改主題
這邊我遇到不少問題，而且我以前都沒有認真處理過jekyll，所以這邊我花一些時間。但不得不說cursor實在是太好用了，幫我節省了超大量的時間。
我主要修改了原始theme中的這些內容:
1.需要修改的各項資料(姓名，說明，圖片，連結...)大部分都在`_config.yml`中
2.我個人喜歡深色系的，所以直接叫cursor弄了個全局深色模式，再稍微修改一下就行
3.我發現他的blog系統是額外的網址，本身的blog系統已經刪除了，所以我再叫cursor幫我生成一個新的blog系統，雖然有點簡陋，但至少能支援markdown語法還能根據tag搜尋


### 6. 本地預覽
```bash
bundle exec jekyll serve
```
用這個指令可以在本地預覽網站，網址是 `http://localhost:4000`。


### 7. 部署到 GitHub Pages
1. 在 GitHub 建立一個新的 Repository，名稱要用 `username.github.io`(username是你的github帳號)
2. 把修改好的檔案推上去：
   ```bash
   git add .
   git commit -m "更新網站"
   git push
   ```
3. 等個幾分鐘，就可以用 `username.github.io` 看到網站了
4. 如果要更新網站，重複上面的動作即可，"更新網站"這個是你這次更新的內容，有空可以修改一下

## 參考資源
- [Jekyll 官方文件](https://jekyllrb.com/docs/)
- [Jekyll-Uno-Timeline](https://github.com/tzuehlke/jekyll-uno-timeline/)
- [Pixabay 工作區照片](https://pixabay.com/photos/desk-laptop-notebook-pen-workspace-593327/)
- [GitHub Pages 文件](https://docs.github.com/pages)
- [使用 Jekyll 和搭建 Github Pages](https://hackmd.io/@CynthiaChuang/Setting-Up-a-GitHub-Pages-Site-with-Jekyll) 