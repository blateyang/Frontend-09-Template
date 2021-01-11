课前预习笔记：
## 1. Git和github的使用
### 1.1 git的使用
1. 简介：git是linux之父Linus开发的分布式版本控制系统，方便我们项目进行版本控制
2. 简单操作流程
- 新建项目文件夹并初始化项目或拉取远端项目：`git init`/`git clone 远端项目地址`
- 将添加/修改的文件添加的暂存区：`git add 文件名`或`git add .`
- 将暂存区的文件添加到本地仓库： `git commit -m 提交说明`
- 查看项目当前git状态：  `git status`
### 1.2 github的使用
1. 简介：github是全球最大的基于git的免费代码托管平台
2. 添加仓库的两种方法：
  - 在github上新建仓库
  - fork别人的仓库
3. 将本地仓库和远程仓库连接：`git remote add origin 远程仓库的ssh地址`
4. 生成本地公私钥，并将公钥添加到github上
5. 将本地仓库同步到远端github仓库:`git push -u origin main`

