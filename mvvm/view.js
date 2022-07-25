class View {
  /** 
   * @Desc:   view实例的构造函数 
   * @Parm:   {String/Node} el 选择器或node节点
   *          {Object} vm mvvm实例对象
   */  
  constructor(el, vm) {
    this.vm = vm
    this.el = this.isElementNode(el) ? el : document.querySelector(el)
    if(this.el) {
      // 将已有的el元素的所有子元素转成文档碎片
      this.fragment = this.node2Fragment(this.el)
      // 解析文档碎片
      this.parseFragment(this.fragment)
      // 将文档碎片添加到el元素中
      this.el.appendChild(this.fragment)
    }
  }

  /**  
   * @Desc:   解析文档碎片 
   * @Parm:   {Object} fragment 文档碎片 
   */  
  parseFragment(fragment) {
    let nodes = [].slice.call(fragment.childNodes)
    for(let node of nodes) {
      switch(node.nodeType) {
        case Node.ELEMENT_NODE:
          this.parseNodeBind(node)
          break
        case Node.TEXT_NODE:
          let text = node.textContent
          if(text && text.trim().length && /\{\{(.*)\}\}/.test(text)) {
            this.parseNodeText(node,RegExp.$1)
          }
          break  
        default:
          break
      }

      if(node.childNodes && node.childNodes.length) {
        this.parseFragment(node)
      }
    }
  }

  /** 
   * @Desc:   解析Node节点的绑定属性
   * @Parm:   {Object} node Node节点 
   */  
  parseNodeBind(node) {
    let nodeAttrs = [].slice.call(node.attributes)
    for(let attr of nodeAttrs) {
      if(!binder.is(attr.name)) continue
      let bindValue = attr.value,
          bindType = attr.name.substring(2)
      binder.isEvent(bindType) 
      ? binder.event(node, this.vm, bindValue, bindType)
      : binder[bindType] && binder[bindType](node, this.vm, bindValue.trim())
      // 移出绑定属性
      node.removeAttribute(attr.name)
    }
  }

  /** 
   * @Desc:   解析Node节点的模板{{}}
   * @Parm:   {Object} node Node节点 
   *          {String} val 模板中的绑定值
   */  
  parseNodeText(node, val) {
    binder.text(node, this.vm, val.trim())
  }

  /** 
   * @Desc:   判断节点类型是否是Element节点
   * @Parm:   {Object} node Node节点
   */  
  isElementNode(node) {
    return node.nodeType === Node.ELEMENT_NODE
  }

  /** 
   * @Desc:   将node节点转为文档碎片 
   * @Parm:   {Object} node Node节点 
   */  
  node2Fragment(node) {
    let fragment = document.createDocumentFragment(),
        child;
    while(child = node.firstChild) {
      // 注意，给文档碎片添加一个节点，该节点会自动从node中删除
      fragment.appendChild(child)
    }    
    return fragment
  }
}