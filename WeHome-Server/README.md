# WeHome设备控制 Demo


## 数据库设计
```
cSessionInfo
open_id|uuid|skey|create_time|last_visit_time|session_key|user_info

devicesInfo
deviceName|userId

products
ProductKey|NodeType|ProductName|DeviceCount|GmtCreate

devices
DeviceName|ProductKey|DeviceSecret|GmtCreate|GmtModified|GmtActive|GmtOnline|Status

clients
DeviceName|ProductKey|DeviceSecret|GmtCreate|GmtModified|GmtActive|GmtOnline|Status

```
## 实现框架
设备控制使用M2M方式实现，共设置3类products，分别为Server，Clients，Devices。

服务器端Server负责进行各设备在阿里云的注册，并进行消息路由的管理。
Clients和Devices向私有服务器发出请求，获得自己在阿里iot中的注册信息，本地处理得到连接密码后，通过mqtt协议连接到阿里云服务器。

---

## 部署方式
将代码克隆到本地后，安装依赖，按照自己的情况配置config.js。

使用node tools/initdb.js初始化数据库。

配置nginx反向代理，核心配置如下。
```nginx.conf
location /wehome/ {
    proxy_pass http://127.0.0.1:5757/;
    proxy_http_version	1.1;
    proxy_cache_bypass	$http_upgrade;
    proxy_set_header Upgrade			$http_upgrade;
    proxy_set_header Connection 		"upgrade";
    proxy_set_header Host				$host;
    proxy_set_header X-Real-IP			$remote_addr;
    proxy_set_header X-Forwarded-For	$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto	$scheme;
    proxy_set_header X-Forwarded-Host	$host;
    proxy_set_header X-Forwarded-Port	$server_port;
}
```