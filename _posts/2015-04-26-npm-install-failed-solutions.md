---
layout: post
title: npm安装组件包失败的解决办法
description: "npm安装组件包失败,npm国内镜像,npm镜像"
tags: [npm]
comments: true
---

国内使用npm安装组件包时，因大自然的因素，导致经常抽风，出现各种安装失败或安装途中出现错误。

可以更改registry的值改为国内一些npm镜像，这里推荐A厂taobao车间：[https://npm.taobao.org](https://npm.taobao.org)

###命令行使用config命令修改npm配置（一劳永逸）
{% highlight bash %}
npm config set registry https://registry.npm.taobao.org/
{% endhighlight %}

###临时工最爱
{% highlight bash %}
npm install bower --registry=https://registry.npm.taobao.org/
{% endhighlight %}

###颜值爆表就是不改
能连上，但安装失败时，可尝试清除一下缓存再安装
{% highlight bash %}
npm cache clean
{% endhighlight %}