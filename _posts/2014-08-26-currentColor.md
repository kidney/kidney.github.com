---
layout: post
title: currentColor
description: "CSS3 currentColor"
tags: [CSS3, currentColor]
comments: true
---

在CSS3出现之前，`border`的颜色在没有指定情况下，默认是继承`color`的值，但是没有赋予关键字来标识。

在CSS3出现之后，`currentColor`的关键字面世了，它是`color`的属性，相当于当前元素的`color`颜色。


有了这个关键字，我们可以应用于：

 - background-color
 - border-color
 - box-shadow
 - text-shadow

漏了`color`？如果把这个关键字用于`color`上，效果就等同于`color: inherit`，


[DEMO](/demo/currentColor/demo.html)