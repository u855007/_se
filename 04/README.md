母專案:https://github.com/se-dd5/git-examples
  分支:https://github.com/se-dd5/git-examples/tree/developGitBranch
子專案:https://github.com/u855007/git-examples
* **GitHub 子專案**：
  開啟母專案 `se-dd5/git-examples` ➔ 點擊右上角 **Fork** ➔ 成功在個人帳號下創造子專案 `u855007/git-examples`。

* **從個人遠端倉庫下載專案**：

  # 使用 SSH 安全連線將專案 Clone 到本地
  git clone git@github.com:u855007/git-examples.git
  
  # 切換進入專案資料夾
  cd git-examples
  ```

* **【觀念】關於分支 (Branch) 的控制指令**：
  ```
  # 檢視目前所有分支
  git branch
  # 創造新分支，並直接切換過去（合體快捷指令）
  git checkout -b developGitBranch


---

### 修改檔案與本地提交 (Commit & Merge)
我們在本地對專案進行了實際的修改，並將變更記錄到 Git 歷史中。

* **新增檔案並提交**：
  ```
  # 將工作區所有新增、修改的檔案（包含 u855007Fork.md）加入暫存區
  git add .
  
  # 提交變更並記錄說明訊息
  git commit -m "add u855007Fork.md"
  ```

* **【觀念】如何進行本地合併 (Merge)**：
  如果今天在 `developGitBranch` 分支寫好功能，要將其合併回 `main` 分支，指令關係如下：
  ```
  git checkout main             # 先切換回接收變更的主分支
  git merge developGitBranch    # 【本地合併】將開發分支的內容融合進來
  ```

---

##  申請合併回母專案 
  1. 開啟個人子專案網頁：`https://github.com`。
  2. 點擊畫面上方自動跳出的黃綠色提示鈕 **「Compare & pull request」**。
  3. 設定正確的對比方向（左邊選母專案，右邊選自己的子專案）：
     * **base repository**: `se-dd5/git-examples` (branch: `main` 或指定分支)
     * **head repository**: `u855007/git-examples` (branch: `main`)
  4. 填寫標題後點擊 **「Create pull request」**，正式遞交合併申請！
