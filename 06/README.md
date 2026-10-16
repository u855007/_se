# Docker 學習記錄與微服務系統實作

## 1. Docker 學習記錄

### 什麼是 Docker?
Docker 是一個開源平台，允許開發者將應用程式及其所有依賴項打包成一個標準化的單元，稱為 **容器 (Container)**。這解決了「在我的電腦上可以跑，但在你的電腦上不行」的問題。

### 核心概念
- **Image (映像檔)**: 類似於虛擬機的快照或類別 (Class)，包含了執行程式所需的所有檔案、設定和環境。它是唯讀的。
- **Container (容器)**: 映像檔的執行實例 (Instance)。容器是獨立且隔離的環境，可以在任何安裝了 Docker 的機器上運行。
- **Dockerfile**: 一個文本檔案，包含了一系列指令，告訴 Docker 如何自動化構建一個映像檔。
- **Volume (卷)**: 用於持久化數據。容器被刪除時，其內部數據會消失，而 Volume 將數據存在宿主機上。
- **Network (網路)**: 允許不同的容器之間互相通信。
- **Docker Compose**: 一個工具，可以用單一的 `.yml` 檔案定義和運行多個容器的應用系統。

### 常用指令
- `docker build -t <name> .` : 構建映像檔
- `docker run -p <host_port>:<container_port> <image>` : 啟動容器
- `docker ps` : 查看運行中的容器
- `docker-compose up -d` : 在背景啟動 compose 定義的所有服務
- `docker-compose down` : 停止並移除所有服務
