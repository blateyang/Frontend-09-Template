学习笔记

## 1 问题记录
1. inline-block元素行间距莫名变大问题
原因： 两排inline-block元素之间有换行或空白文本，它们和inline-block元素同级，html又默认有个字号，作用在这些空白符上导致出现莫名的间距。
解法：
- 设置父容器的font-size=0或line-height=0
- 不设置DTD，让浏览器按奇异模式解析  
2. inline-block元素的border-size呈现的尺寸和设置的尺寸不一致，导致在固定总宽度情况下一行的元素数量与预期不符
原因：页面的缩放比例不合适
解法：调整到合适的缩放比例或者使用box-size:border-box将inline-block连同border限定死

## 2 相关知识
1. 启发式搜索A*算法
A*算法是一种很常用的路径查找和图形遍历算法，有较好的性能和准确度，其发表于1968年，可以被认为是Dijkstra算法的扩展，由于借助启发函数的引导，通常拥有更好的性能。
在介绍A*算法前，先要了解几个前置的搜索算法：广度优先（BFS），Dijkstra算法和最佳优先搜索算法。
- 广度优先搜索算法
该算法也被称为洪泛法（遍历过程就像洪水泛滥一样），它的基本思想是先遍历起点周围的相邻节点，再遍历这些相邻节点周围的相邻节点，逐层向外遍历，直到找到终点为止。在执行算法的过程中，每个点要记录到达当前点的前一个节点的位置，以便到达终点时能够反向顺着记录的位置到达起点得到路径。

代码示例
```javascript
function BFS(preTable, start, end) {
  function insert(x, y, preCoords) {
    if(x<0 || x>=M || y<0 || y>=N) {
      return // 跳过边界
    }
    if(preTable[M*y + x]) {
      return // 跳过已遍历过的点
    }

    preTable[M*y + x] = preCoords
    queue.push([x, y]) // 加入到待遍历队列
  }
  let queue = [start]
  while(queue.length) {
    let [x, y] = queue.shift() // 将此处改成queue.pop()就是模拟栈结构的深度遍历
    // 到达终点
    if(x === end[0] && y === end[1]) {
      let path = [[x, y]]
      while(x !== start[0] || y !== start[1]) {
        path.push(preTable[M*y + x])
        ;[x, y] = preTable[M*y + x]
      }
      return path
    }

    // 广度搜索[x, y]的八邻域
    insert(x, y-1, [x, y])
    insert(x+1, y-1, [x, y])
    insert(x+1, y, [x, y])
    insert(x+1, y+1, [x, y])
    insert(x, y+1, [x, y])
    insert(x-1, y+1, [x, y])
    insert(x-1, y, [x, y])
    insert(x-1, y-1, [x, y])
  }
  return null
}
```
- Dijkstra算法
该算法由计算机科学家Dijkstra在1956年提出，用来寻找图形中节点之间的最短路径。在Dijkstra算法中，需要计算每个节点到起点的总移动代价，还需要一个优先队列结构。对于所有待遍历的节点，放入优先队列中的节点会按照移动代价进行排序。在算法运行过程中，每次都从优先队列中选出代价最小的节点作为下一个遍历的节点，直至找到终点。当图形为网格图且每个节点间的移动代价相等，Dijkstra算法退化成BFS。
- 最佳优先（Best-First)搜索算法
与Dijkstra算法类似，也使用优先队列结构，但最佳优先搜索算法以每个节点到终点的距离作为优先级，每次始终选取到终点移动代价最小（距离最短）的点作为下一个遍历的节点，这样可以大大加快搜索速度，但不能保证获得的路径最优。
- A*算法
A*算法综合以上算法的特点于一身，也使用优先队列，并通过一个综合优先级函数f(n)计算每个节点的优先级, f(n)=g(n)+h(n)
  - f(n)表示综合优先级，每次选择下一个要遍历的节点时，总是选综合优先级最高（值最小）的节点
  - g(n)表示节点n距离起点的代价
  - h(n)表示节点n距离终点的预计代价，也被称为启发函数

A*算法通常用两个集合open_set和close_set来分别表示待遍历的节点和已遍历的节点，算法描述如下：
```
1. 初始化open_set和close_set
2. 将起点视为优先级最高的点加入到open_set中
3. 如果open_set不为空，则从open_set中取出优先级最高的节点n:
4.  如果节点n是终点：
      沿着节点n的前驱节点依次向前找到起点
      确定路径，算法结束
5.  如果节点n不是终点：
      将节点n从open_set中删除，并加入到close_set中
      遍历节点n的所有邻近节点:
        如果邻近节点m在close_set中:
          跳过，访问下一个邻近节点
        如果节点m不在open_set中:
          将节点m的前驱节点设为节点n
          计算节点m的优先级
          将节点m加入到open_set中
```

常见的启发函数有曼哈顿距离（沿四邻域搜索）、对角距离（沿八邻域搜索）和欧式距离（沿任意方向搜索），数学上已经证明，当启发函数h(n)<=当前节点n到终点的实际代价，可以保证找到最短路径，并且h(n)越大，耗时越短。

参考：https://blog.csdn.net/qq_21989927/article/details/109676570