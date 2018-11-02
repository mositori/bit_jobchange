# bit_jobchange
## 環境構築
### テストまでの流れ
TruffleとGanacheをインストールする。

`
python3 -m http.server
`
でサーバーを建てた後、Ganacheを起動しtruffle.jsに記載されているRPCサーバーのアドレスとポートが一致するようにGanache側を設定する。
次に、
`
truffle migrate --reset
`
を実行し、Ganacheブロックチェーン上にデプロイする。

`
localhost:8000/src
`

にアクセスしConsoleを覗いてみてください。


### Truffle
`
npm i -g truffle
`

### Ganache
https://truffleframework.com/ganache

### コンパイル方法

`
truffle compile
`

### デプロイ方法

`
truffle migrate
`
truffle.jsファイルにデプロイ先のネットワークを指定
GanacheのRPCサーバー先に合わせる事でGanacheを利用可能
