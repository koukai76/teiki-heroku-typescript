.env

```
EXPO_ID=
EXPO_ID2=
EXPO_ID3=
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
