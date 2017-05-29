---
layout: post
title: 移动端坑 input[type="text"] event
description: "移动端坑,input text,input,compositionstart,compositionend,ime"
tags: [IME, 移动端坑, compositionend]
comments: true
---

# 移动端坑 input[type="text"] event

input[text="text"]是接受用户输入的途径之一，经常要对输入内容进行过滤、替换、校验等处理，通常使用事件：

 - keyup
 - keypress
 - keydown
 - blur
 - focus
 - input
 - change
 - compositionstart
 - compositionupdate
 - compositionend

> 产品MM：帮我在已有页面加一个功能，让用户能输入自己姓名的拼音，只能出现a-z，大小写没关系
> 
> 前端GG：给我一首歌的时间

在pc场景直接使用 `keyup` `keypress` `keydown` `blur` `input` ，足够达到这个需求

```js
$('.J-lastname-py-input').on('blur', function() {
    var val = this.value.toLowerCase().replace(/[^a-z]/g, '');
    this.value = val;
});
```

> 产品MM：刚才忘记了，还有移动端那个页面都加上。

copy and paste the code to mobile
梦想是要有的

自测一下

![enter image description here](https://lh3.googleusercontent.com/QJx_fvX93r_BpLv6X9cih4KejpZVWHEZo26GA_xZpOdF3lJWr3CxbnvFkhB8FOAdFUmSHb81SUiE1tPQ0oie5SCR5iX48To8L2q6EAqhQ_qD83WqzPvn2rinItih15bOkR6y5BJoYIT_MZbHs6C9gjCEN3HbdKKcLNAfjzA1by_oyR8iEdzvesgVyt2j8G2_olDY8Y1luTmugT4nO9MiHz-2SBzXEIRtkljUpw-tmcMERusIrN6ylDbMyZX15IKUjXYmteNdecMEHdJgzPLGI0jk8alayYUZh1dmO8pH1A9OaTRJg88Z-unBn34aU38bFlTdclgUmVyX2XOEaqe18wkQFdzv7xvZwBQXyx6PpnvSE5mwIWD5_fo93kBATDBdDryuAM8xE9H5XEeTPxOkXLqS8qzPhd8yw4WEsCiI6ncxbrU-J5SFszwzLy7hN3aRBP-jz7MN1G3GT2dHLdBuI-oJHN2rsrF9OQXZB75mUxURIBuhYnqqy2fpelbLh15Yvu9lOk8gmiIsGegPgSSyrT3eJ1zWfNGmR-F6AN1Njo_jiaJFLPjwcYKscvzhcmcMZtdpugbuJZUMUF4t2k0yItIkssFvq88u-Zzfe44Sv9NJaz6OzZnz9E7kCccBYVbaQtTs8FtX5FrYShBQzirQHg-8lMabad65M1qwsD3Kkg=w268-h480-no "input-event-1.gif")


原生拼音输入法，在输入完成时，点击下一个input时，本来聚焦的input出现重复的字问题


最终定位到这2段现有代码：

```js
$('.J-lastname-py-input').on('blur', function() {
    var val = this.value.toLowerCase().replace(/[^a-z]/g, '');
    this.value = val;
});
inputs.on('focus', function () {
    this.select();
});
```


`this.select();` 希望聚焦时全选input中的文字，删除就解决重复出现，Why？


> 调用 element.select() 并不一定会使得该 input 元素获得焦点
> 
> https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLInputElement/select

提取关联代码，demo测试，[Demo](//jsfiddle.net/kidney/vo3w2fxq/embedded/)

![enter image description here](https://lh3.googleusercontent.com/-r51KQ0MdesE/WN4j10_BcUI/AAAAAAAAAMU/zNe_xZ7VC8cS9MrmFpSM0YybOqMHVBXhgCE0/s0/input-event-2.gif "input-event-2.gif")


### 动作分解：
 1. 输入完毕，点击 `input-2`（这是常见的用户操作流程）
 2. `input-1` 触发 `blur` 事件
 3. `input-2` 触发 `focus` 事件
 4. ios的中文输入框候选字（Input Method Editor模式）注入 `input-1` 
 5. `input-1` 被重新触发 `focus` 事件
 6. `this.select()` 
 7. 连续的3次 `input` 事件，只有ios10.3会出现，每次 `value` 不一样，还有找到根本的原因，估计是BUG（测试场景10.3、10.2.1、10.0.2、9.3.5、8.11）。


### 存在问题：

 1. 重复字BUG
 2. 每次键入而未选中候选字， `input` 事件都触发，可能导致性能问题
 3. 如果涉及键入文字计算存在问题，详见此文【文字输入限制问题】部分：http://www.alloyteam.com/2017/03/moves-the-input-box-fill-series-a/
 4. `blur` 事件代表着点击其他区域才能失去焦点从而处理字符，这时键盘可能被收起或误触发其他交互，在移动端上简直是糟糕的体验

### 解决方案：

 1. 去除 `select()` 
 2. IME模式使用  `compositionend`
 3. 使用 `input` 和 `setTimeout` 兼容英文输入法、搜狗百度第三方输入、直接粘贴内容，不会触发`compositionend` 问题


[Demo](//jsfiddle.net/kidney/ydagum03/embedded/)


```js
function formatString(s) {
    return (s + '').toLowerCase().replace(/[^a-z]/g, '');
}
var inputTimer, IMELocked = false;
var $input = $('.J-lastname-py-input');
$input.on('compositionstart', function () {
    IMELocked = true;
    $input.one('compositionend', function () {
        IMELocked = false;
        var that = this;
        setTimeout(function () {
            that.value = formatString(that.value);
            that = null;
        }, 0);
    });
}).on('input', function () { // 兼容非IME模式
    if (!IMELocked) {
        var that = this;
        clearTimeout(inputTimer);
        inputTimer = setTimeout(function () {
            inputTimer = null;
            that.value = formatString(that.value);
            that = null;
        }, 200);
    }
});
```


上文提到的**聚焦时全选文字**可以使用 `setSelection` 来实现，但这带来的用户体验一般，不太适合这种场景：

```js
$('.J-lastname-py-input').on('focus', function() {
    if (this.value) {
        this.setSelectionRange(0, this.value.length);
    }
});
``` 
