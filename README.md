# jquery.timeline.js
jQueryオブジェクトのスタイルを順々に操作する記法を提供するライブラリです。実行のハンドリングにはjQuery.Deferredを使用します。開発時のjQueryのバージョンは1.11.2です。

demo:
http://rrlrlrll.org/jquery.timeline.js/

## Browser
- Internet Explorer 8+
- Safari 6+
- Google Chrome
- Firefox

## Getting start
`.hoge`を操作する最もシンプルな例。
```javascript
var t = new $.Timeline;
t.bind('.hoge')
  .set({
      position: 'absolute',
      top: 0
      left: 0
  })
  .to({
    top: 200
  }, { duration: 200, easing: 'linear' })
  .to({
    left: 200
  }, { duration: 200, easing: 'linear' });
t.run();
```

## Create timeline
タイムラインを利用するには`$.Timeline`を`new`します。
```javascript
var t = new $.Timeline;
```

## Running timeline
タイムラインを実行するには`.run`メソッドを実行します。全ての定義されたタスクは`.run`が発火するまで実行されることはありません。`.run`はコールバック関数を受け取ることが出来ます。
```javascript
var t = new $.Timeline;
t.bind('.hoge')
  .to({ marginTop: 100 }, { duration: 1000 });
t.run( function(){ console.log('complete') } );
```

## Destroy timeline
タイムラインを破棄するには`.destroy`メソッドを実行します。アニメーションは停止され、定義された全てのタスクは破棄されますが、オブジェクトは破壊されません。
```javascript
var t = new $.Timeline;
t.bind('.hoge')
  .to({ marginTop: 100 }, { duration: 1000 });
t.run();

setTimeout(function(){
  t.destroy();
}, 500);
```

## Binding element
操作するエレメントを`.bind`メソッドでバインドすることができます。jQueryオブジェクトが生成はタイムラインの実行とは別に、`.bind`が実行された瞬間に行われます。bindはタイムラインの中で何度でも行うことが可能です。
```javascript
var t = new $.Timeline;
t.bind('.hoge')
  .run();
```

## Set style
`.set`はタイムラインの実行時にスタイルを適用します。スタイルの適用にはjQueryの`.css()`が呼び出されます。第一引数にスタイルのオブジェクトを渡します。
```javascript
var t = new $.Timeline;
t.bind('.hoge')
  .set({
      position: 'absolute',
      top: 0,
      left: 0
  });
t.run();
```

## Set animation
`.to`はタイムラインの実行時にアニメーションを適用します。アニメーションの適用にはjQueryの`.animate()`が呼び出されます。第一引数にはスタイルのオブジェクト、第二引数にはanimateに渡されるオプションを渡しますが、completeは使用することが出来ません。
```javascript
var t = new $.Timeline;
t.bind('.hoge')
  .set({
      position: 'absolute',
      top: 0,
      left: 0
  })
  .to({
    top: 200
  }, { duration: 200, easing: 'linear' });
t.run();
```

## Set delay
`.wait`はタイムラインの実行間隔を定義します。delayではなくsetTimeoutが呼び出されます。
```javascript
var t = new $.Timeline;
t.bind('.hoge')
  .set({
      position: 'absolute',
      top: 0,
      left: 0
  })
  .to({
    top: 200
  }, { duration: 200, easing: 'linear' })
  .wait(1000)
  .to({
    left: 200
  }, { duration: 200, easing: 'linear' });
t.run();
```

## Set call function
`.call`は渡された関数を実行します。第一引数に渡されるdone関数を実行することで、任意のタイミングで次のタスクを実行することができます。
```javascript
var t = new $.Timeline;
t.bind('.hoge')
  .wait(1000)
  .call(function(done) {
    console.log('complete');
    done();
  });
t.run();
```

## Set remove
`.remove`はbindされたエレメントをドキュメントから除外する際に利用します。
```javascript
var t = new $.Timeline;
t.bind('.hoge')
  .set({
      position: 'absolute',
      top: 0,
      left: 0
  })
  .to({
    top: 200
  }, { duration: 200, easing: 'linear' })
  .wait(1000)
  .to({
    left: 200
  }, { duration: 200, easing: 'linear' })
  .remove();
t.run();
```

## Include timeline
`.include`は別で定義されたタイムラインを呼び出します。
```javascript
var t1 = new $.Timeline;
var t2 = new $.Timeline;
var t3 = new $.Timeline;

t2.bind('.hoge')
  .set({
      position: 'absolute',
      top: 0,
      left: 0
  })
  .to({
    top: 200
  }, { duration: 200, easing: 'linear' });

t3.bind('.fuga')
  .set({
      position: 'absolute',
      top: 0,
      left: 0
  })
  .to({
    left: 200
  }, { duration: 200, easing: 'linear' });

t1.wait(1000)
  .include(t2)
  .include(t3);
t1.run();
```

## 非同期処理
`.to`, `.call`, `.include`では、オプションに`async: true`を渡すことで実行の完了を待たずに次の処理を行うことが可能です。例えば、タイムラインが2つ以上の操作に分岐する場合に利用します。
```javascript
t.bind('.hoge')
  .to({
    top: 200
  }, { duration: 200, easing: 'linear', async: true })
.bind('.fuga')
  .to({
    left: 200
  }, { duration: 200, easing: 'linear' });
t.run();
```
