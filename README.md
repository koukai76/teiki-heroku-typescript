.env

```
EXPO_ID=
EXPO_ID2=
```

### 本番
```
$ npx heroku config:set EXPO_ID="値"
$ npx heroku config:set EXPO_ID2="値"
$ npx heroku config:set HEROKU_API_KEY="値"
$ npx heroku config:set PROJECT_NAME="値"
```

## タイムゾーン

```
$ npx heroku config:add TZ=Asia/Tokyo --app アプリ名
```

### 依存関係解決法(Dependabot)

```
https://tech-1natsu.hatenablog.com/entry/2020/08/24/210520
```