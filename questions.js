// 各ユニット = AWS SAAの出題領域。レッスン = 5問。q:問題 / o:選択肢 / a:正解index / e:解説
const UNITS = [
{ id:"compute", title:"コンピューティング", desc:"EC2 / Lambda / ECS", lessons:[[
 {q:"サーバー管理なしでイベント駆動のコードを実行できるサービスは？",o:["EC2","Lambda","Lightsail","Batch"],a:1,e:"Lambdaはサーバーレスで、使った分だけ課金されます。"},
 {q:"中断可能なワークロードを最大90%安く実行できるEC2購入オプションは？",o:["オンデマンド","リザーブド","スポットインスタンス","Dedicated Host"],a:2,e:"スポットは余剰キャパシティを割引で利用でき、AWSが回収する場合があります。"},
 {q:"トラフィックに応じてEC2台数を自動増減させる機能は？",o:["Auto Scaling","CloudFront","Route 53","Direct Connect"],a:0,e:"EC2 Auto Scalingで需要に応じた増減とヘルスチェック置換ができます。"},
 {q:"Dockerコンテナをサーバー管理なしで実行できるECS/EKS用の起動タイプは？",o:["Fargate","Outposts","Snowball","Wavelength"],a:0,e:"FargateはEC2ノード管理が不要です。"},
 {q:"1〜3年の利用コミットで割引を受けられる購入オプションは？",o:["Savings Plans","スポット","オンデマンド","Free Tier"],a:0,e:"Savings Plans/リザーブドインスタンスは長期コミットで割引されます。"}]]},
{ id:"storage", title:"ストレージ", desc:"S3 / EBS / EFS", lessons:[[
 {q:"ほぼ無制限のオブジェクトストレージはどれ？",o:["EBS","S3","EFS","FSx"],a:1,e:"S3は耐久性99.999999999%のオブジェクトストレージです。"},
 {q:"単一EC2にアタッチするブロックストレージは？",o:["S3","EBS","Glacier","Storage Gateway"],a:1,e:"EBSはEC2用のブロックストレージです。"},
 {q:"複数のLinux EC2から同時にマウントできるマネージドNFSは？",o:["EBS","EFS","S3","Instance Store"],a:1,e:"EFSは複数AZ・複数インスタンスから共有できます。"},
 {q:"アクセス頻度が不明なデータを自動で最適な階層に移すS3クラスは？",o:["S3 Standard-IA","S3 Intelligent-Tiering","S3 Glacier Deep Archive","S3 One Zone-IA"],a:1,e:"Intelligent-Tieringはアクセスパターンに応じ自動で階層移動します。"},
 {q:"S3オブジェクトの誤削除対策として有効な機能は？",o:["バージョニング","CORS","Transfer Acceleration","Requester Pays"],a:0,e:"バージョニングで以前の版を復元できます。MFA Deleteも併用可能です。"}]]},
{ id:"network", title:"ネットワーク", desc:"VPC / Route 53 / CloudFront", lessons:[[
 {q:"AWS内の論理的に分離された仮想ネットワークは？",o:["VPC","CloudFront","Direct Connect","Global Accelerator"],a:0,e:"VPCで独自のIP範囲・サブネット・ルーティングを定義します。"},
 {q:"プライベートサブネットのEC2がインターネットへ送信のみ可能にするには？",o:["Internet Gateway直結","NAT Gateway","VPN","Egress不可"],a:1,e:"NAT Gatewayはパブリックサブネットに置き、送信のみを許可します。"},
 {q:"グローバルなエッジでコンテンツをキャッシュ配信するサービスは？",o:["CloudFront","Route 53","ELB","VPC Peering"],a:0,e:"CloudFrontはCDNです。"},
 {q:"オンプレとAWSを専用線で接続するサービスは？",o:["Site-to-Site VPN","Direct Connect","Transit Gateway","PrivateLink"],a:1,e:"Direct Connectは専用の物理接続を提供します。"},
 {q:"ステートフルでインスタンス単位のファイアウォールは？",o:["ネットワークACL","セキュリティグループ","WAF","Shield"],a:1,e:"セキュリティグループはステートフル、NACLはステートレスでサブネット単位です。"}]]},
{ id:"database", title:"データベース", desc:"RDS / DynamoDB / Aurora", lessons:[[
 {q:"ミリ秒単位の応答でスケールするサーバーレスNoSQLは？",o:["RDS","DynamoDB","Redshift","Neptune"],a:1,e:"DynamoDBはフルマネージドのキーバリュー/ドキュメントDBです。"},
 {q:"RDSの高可用性（自動フェイルオーバー）を実現する設定は？",o:["リードレプリカ","Multi-AZ","スナップショット","パラメータグループ"],a:1,e:"Multi-AZは同期レプリケーションでフェイルオーバーします。リードレプリカは読み取り負荷分散用です。"},
 {q:"MySQL/PostgreSQL互換で最大5倍高速をうたうAWSのDBは？",o:["Aurora","DocumentDB","Timestream","QLDB"],a:0,e:"AuroraはAWS独自のクラウドネイティブなリレーショナルDBです。"},
 {q:"ペタバイト級の分析向けデータウェアハウスは？",o:["Redshift","ElastiCache","DynamoDB","RDS"],a:0,e:"RedshiftはOLAP向けの列指向DWHです。"},
 {q:"DBの読み取りを高速化するインメモリキャッシュは？",o:["ElastiCache","Glue","Athena","Kinesis"],a:0,e:"ElastiCache(Redis/Memcached)でDB負荷を軽減します。"}]]},
{ id:"security", title:"セキュリティ", desc:"IAM / KMS / 責任共有", lessons:[[
 {q:"AWSで最小権限を実現するために使うサービスは？",o:["IAM","Inspector","Macie","Artifact"],a:0,e:"IAMでユーザー・ロール・ポリシーを管理します。"},
 {q:"EC2がS3にアクセスする際、認証情報を埋め込まずに済む方法は？",o:["アクセスキーをコードに記載","IAMロール","ルートユーザー","パスワード"],a:1,e:"インスタンスプロファイル経由のIAMロールで一時認証情報を使います。"},
 {q:"暗号化キーを作成・管理するサービスは？",o:["KMS","Cognito","GuardDuty","WAF"],a:0,e:"KMSでキー管理と暗号化を統合します。"},
 {q:"SQLインジェクションやXSSからWebアプリを守るサービスは？",o:["AWS WAF","Shield","Config","Trusted Advisor"],a:0,e:"WAFはL7のWebリクエストをルールでフィルタします。"},
 {q:"責任共有モデルで、顧客が責任を負うのは？",o:["物理データセンター","ハイパーバイザー","OS上のパッチ(EC2)","ハードウェア廃棄"],a:2,e:"クラウド「の」セキュリティはAWS、クラウド「内」のセキュリティは顧客の責任です。"}]]}
];
