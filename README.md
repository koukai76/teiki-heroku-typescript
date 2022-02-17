### 開発

.env

```
EXPO_ID=
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
