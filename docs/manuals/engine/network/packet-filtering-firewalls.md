---
title: 패킷 필터링 및 방화벽
weight: 10
description: Docker가 패킷 필터링, iptables 및 방화벽과 함께 작동하는 방법
keywords:
  - 네트워크
  - iptables
  - 방화벽
aliases:
  - /network/iptables/
  - /network/packet-filtering-firewalls/
---

Linux에서 Docker는 네트워크 격리, 포트 게시 및 필터링을 구현하기 위해 `iptables` 및 `ip6tables` 규칙을 생성합니다.

이 규칙들은 Docker 브리지 네트워크의 올바른 기능을 위해 필요하므로 Docker가 생성한 규칙을 수정해서는 안 됩니다.

하지만, 인터넷에 노출된 호스트에서 Docker를 실행하는 경우, 컨테이너 또는 호스트에서 실행 중인 다른 서비스에 대한 무단 액세스를 방지하기 위해 iptables 정책을 추가하고 싶을 것입니다. 이 페이지에서는 이를 달성하는 방법과 주의해야 할 사항을 설명합니다.

:::note
Docker는 브리지 네트워크에 대해 `iptables` 규칙을 생성합니다.

`ipvlan`, `macvlan` 또는 `host` 네트워킹에 대해서는 `iptables` 규칙이 생성되지 않습니다.
:::

## Docker와 iptables 체인 {#docker-and-iptables-chains}

`filter` 테이블에서 Docker는 기본 정책을 `DROP`으로 설정하고 다음과 같은 사용자 정의 `iptables` 체인을 생성합니다:

- `DOCKER-USER`
  - `DOCKER` 체인의 규칙보다 먼저 처리될 사용자 정의 규칙의 자리 표시자.
- `DOCKER`
  - 실행 중인 컨테이너의 포트 포워딩 구성에 따라 연결되지 않은 패킷을 수락할지 여부를 결정하는 규칙.
- `DOCKER-ISOLATION-STAGE-1` 및 `DOCKER-ISOLATION-STAGE-2`
  - Docker 네트워크를 서로 격리하는 규칙.

`FORWARD` 체인에서 Docker는 연결되지 않은 패킷을 이러한 사용자 정의 체인으로 전달하는 규칙과 연결된 패킷을 수락하는 규칙을 추가합니다.

`nat` 테이블에서 Docker는 체인 `DOCKER`를 생성하고 마스커레이딩 및 포트 매핑을 구현하는 규칙을 추가합니다.

### Docker의 규칙 전에 iptables 정책 추가 {#add-iptables-policies-before-dockers-rules}

이 사용자 정의 체인의 규칙에 의해 수락되거나 거부된 패킷은 `FORWARD` 체인에 추가된 사용자 정의 규칙에 의해 처리되지 않습니다. 따라서 이러한 패킷을 필터링하기 위해 추가 규칙을 추가하려면 `DOCKER-USER` 체인을 사용하십시오.

### 요청의 원래 IP 및 포트 일치 {#match-the-original-ip-and-ports-for-requests}

패킷이 `DOCKER-USER` 체인에 도달하면 이미 목적지 네트워크 주소 변환(DNAT) 필터를 통과한 상태입니다. 이는 사용자가 사용하는 `iptables` 플래그가 컨테이너의 내부 IP 주소 및 포트만 일치시킬 수 있음을 의미합니다.

네트워크 요청의 원래 IP 및 포트를 기준으로 트래픽을 일치시키려면 [`conntrack` iptables 확장](https://ipset.netfilter.org/iptables-extensions.man.html#lbAO)을 사용해야 합니다. 예를 들어:

```bash
$ sudo iptables -I DOCKER-USER -p tcp -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
$ sudo iptables -I DOCKER-USER -p tcp -m conntrack --ctorigdst 198.51.100.2 --ctorigdstport 80 -j ACCEPT
```

:::important
`conntrack` 확장을 사용하면 성능이 저하될 수 있습니다.
:::

## 포트 게시 및 매핑 {#port-publishing-and-mapping}

기본적으로 IPv4 및 IPv6 모두에 대해 데몬은 게시되지 않은 포트에 대한 액세스를 차단합니다. 게시된 컨테이너 포트는 호스트 IP 주소에 매핑됩니다. 이를 위해 iptables를 사용하여 네트워크 주소 변환(NAT), 포트 주소 변환(PAT) 및 마스커레이딩을 수행합니다.

예를 들어, `docker run -p 8080:80 [...]`는 Docker 호스트의 모든 주소에서 포트 8080과 컨테이너의 포트 80 간의 매핑을 생성합니다. 컨테이너에서 나가는 연결은 Docker 호스트의 IP 주소를 사용하여 마스커레이드됩니다.

### 컨테이너에 대한 외부 연결 제한 {#restrict-external-connections-to-containers}

기본적으로 모든 외부 소스 IP는 Docker 호스트의 주소에 게시된 포트에 연결할 수 있습니다.

특정 IP 또는 네트워크만 컨테이너에 액세스하도록 허용하려면 `DOCKER-USER` 필터 체인의 맨 위에 규칙을 추가하십시오. 예를 들어, 다음 규칙은 `192.0.2.2`를 제외한 모든 IP 주소에서 오는 패킷을 차단합니다:

```bash
$ iptables -I DOCKER-USER -i ext_if ! -s 192.0.2.2 -j DROP
```

`ext_if`를 호스트의 실제 외부 인터페이스에 맞게 변경해야 합니다. 대신 소스 서브넷에서 오는 연결을 허용할 수 있습니다. 다음 규칙은 서브넷 `192.0.2.0/24`에서만 액세스를 허용합니다:

```bash
$ iptables -I DOCKER-USER -i ext_if ! -s 192.0.2.0/24 -j DROP
```

마지막으로, `--src-range`를 사용하여 허용할 IP 주소 범위를 지정할 수 있습니다(`--src-range` 또는 `--dst-range`를 사용할 때 `-m iprange`도 추가해야 함을 기억하십시오):

```bash
$ iptables -I DOCKER-USER -m iprange -i ext_if ! --src-range 192.0.2.1-192.0.2.3 -j DROP
```

`-s` 또는 `--src-range`를 `-d` 또는 `--dst-range`와 결합하여 소스 및 목적지를 모두 제어할 수 있습니다. 예를 들어, Docker 호스트에 `2001:db8:1111::2` 및 `2001:db8:2222::2` 주소가 있는 경우 `2001:db8:1111::2`에 특정한 규칙을 만들고 `2001:db8:2222::2`는 열어둘 수 있습니다.

`iptables`는 복잡합니다. [Netfilter.org HOWTO](https://www.netfilter.org/documentation/HOWTO/NAT-HOWTO.html)에서 더 많은 정보를 확인할 수 있습니다.

### 직접 라우팅 {#direct-routing}

포트 매핑은 게시된 포트가 호스트의 네트워크 주소에서 액세스 가능하도록 보장하며, 이는 외부 클라이언트에게 라우팅 가능할 가능성이 높습니다. 호스트의 네트워크에는 일반적으로 호스트 내에 존재하는 컨테이너 주소에 대한 경로가 설정되지 않습니다.

하지만 특히 IPv6의 경우 NAT를 사용하지 않고 대신 외부 라우팅을 컨테이너 주소로 설정하는 것이 더 나을 수 있습니다.

Docker 호스트 외부에서 브리지 네트워크의 컨테이너에 액세스하려면 Docker 호스트의 주소를 통해 브리지 네트워크로의 라우팅을 설정해야 합니다. 이는 정적 경로, 경계 게이트웨이 프로토콜(BGP) 또는 네트워크에 적합한 다른 방법을 사용하여 달성할 수 있습니다.

브리지 네트워크 드라이버에는 `com.docker.network.bridge.gateway_mode_ipv6=<nat|routed>` 및 `com.docker.network.bridge.gateway_mode_ipv4=<nat|routed>` 옵션이 있습니다.

기본값은 `nat`이며, 각 게시된 컨테이너 포트에 대해 NAT 및 마스커레이딩 규칙이 설정됩니다. `routed` 모드에서는 NAT 또는 마스커레이딩 규칙이 설정되지 않지만, 게시된 컨테이너 포트만 액세스 가능하도록 `iptables`가 설정됩니다.

`routed` 모드에서는 `-p` 또는 `--publish` 포트 매핑의 호스트 포트가 사용되지 않으며, 호스트 주소는 IPv4 또는 IPv6에 매핑을 적용할지 여부를 결정하는 데만 사용됩니다. 따라서 매핑이 `routed` 모드에만 적용되는 경우, 주소 `0.0.0.0` 또는 `::1`만 허용되며 호스트 포트를 지정해서는 안 됩니다.

`nat` 또는 `routed` 모드에서 매핑된 컨테이너 포트는 네트워크에서 라우팅이 설정된 경우 원격 주소에서 액세스할 수 있으며, Docker 호스트의 방화벽에 추가 제한이 없는 한 액세스할 수 있습니다.

#### 예시 {#example}

IPv6에 대해 직접 라우팅에 적합한 네트워크를 생성하고, IPv4에 대해 NAT를 활성화합니다:

```bash
$ docker network create --ipv6 --subnet 2001:db8::/64 -o com.docker.network.bridge.gateway_mode_ipv6=routed mynet
```

게시된 포트가 있는 컨테이너를 생성합니다:

```bash
$ docker run --network=mynet -p 8080:80 myimage
```

그런 다음:

- IPv4 및 IPv6 모두에 대해 컨테이너 포트 80만 열립니다. 네트워크에 컨테이너의 주소로 라우팅이 설정되어 있고 호스트의 방화벽에 의해 차단되지 않은 경우 어디서든 액세스할 수 있습니다.
- IPv6의 경우 `routed` 모드를 사용하여 포트 80이 컨테이너의 IP 주소에서 열립니다. 포트 8080은 호스트의 IP 주소에서 열리지 않으며, 나가는 패킷은 컨테이너의 IP 주소를 사용합니다.
- IPv4의 경우 기본 `nat` 모드를 사용하여 컨테이너의 포트 80은 호스트의 IP 주소에서 포트 8080을 통해 액세스할 수 있으며, 직접 액세스할 수 있습니다. 컨테이너에서 시작된 연결은 호스트의 IP 주소를 사용하여 마스커레이드됩니다.

`docker inspect`에서 이 포트 매핑은 다음과 같이 표시됩니다. IPv6의 경우 `routed` 모드를 사용하므로 `HostPort`가 없습니다:

```bash
$ docker container inspect <id> --format "{{json .NetworkSettings.Ports}}"
{"80/tcp":[{"HostIp":"0.0.0.0","HostPort":"8080"},{"HostIp":"::","HostPort":""}]}
```

대안으로, 매핑을 IPv6 전용으로 만들어 컨테이너의 포트 80에 대한 IPv4 액세스를 비활성화하려면, 지정되지 않은 IPv6 주소 `[::]`를 사용하고 호스트 포트 번호를 포함하지 마십시오:

```bash
$ docker run --network mynet -p '[::]::80'
```

### 컨테이너의 기본 바인드 주소 설정 {#setting-the-default-bind-address-for-containers}

기본적으로 특정 호스트 주소 없이 컨테이너의 포트를 매핑할 때, Docker 데몬은 게시된 컨테이너 포트를 모든 호스트 주소(`0.0.0.0` 및 `[::]`)에 바인딩합니다.

예를 들어, 다음 명령은 호스트의 모든 네트워크 인터페이스에서 포트 8080을 게시하여 IPv4 및 IPv6 주소에서 잠재적으로 외부 세계에 액세스할 수 있도록 합니다.

```bash
docker run -p 8080:80 nginx
```

기본적으로 게시된 컨테이너 포트가 Docker 호스트에만 액세스 가능하도록 기본 바인딩 주소를 변경할 수 있습니다. 이를 위해 데몬을 루프백 주소(`127.0.0.1`)를 사용하도록 구성할 수 있습니다.

:::warning
동일한 L2 세그먼트 내의 호스트(예: 동일한 네트워크 스위치에 연결된 호스트)는 로컬호스트에 게시된 포트에 도달할 수 있습니다.
자세한 내용은 [moby/moby#45610](https://github.com/moby/moby/issues/45610)를 참조하십시오.
:::

사용자 정의 브리지 네트워크에 대해 이 설정을 구성하려면 네트워크를 생성할 때 `com.docker.network.bridge.host_binding_ipv4` [드라이버 옵션](./drivers/bridge.md#options)을 사용하십시오.

```bash
$ docker network create mybridge \
  -o "com.docker.network.bridge.host_binding_ipv4=127.0.0.1"
```

:::note

- 기본 바인딩 주소를 `::`로 설정하면 호스트 주소가 지정되지 않은 포트 바인딩이 호스트의 모든 IPv6 주소에서 작동합니다. 하지만, `0.0.0.0`은 모든 IPv4 또는 IPv6 주소를 의미합니다.
- 기본 바인딩 주소를 변경해도 Swarm 서비스에는 영향을 미치지 않습니다. Swarm 서비스는 항상 `0.0.0.0` 네트워크 인터페이스에 노출됩니다.
  :::

#### 기본 브리지 {#default-bridge}

기본 브리지 네트워크에 대한 기본 바인딩을 설정하려면 `daemon.json` 구성 파일에서 `"ip"` 키를 구성하십시오:

```json
{
  "ip": "127.0.0.1"
}
```

이렇게 하면 기본 브리지 네트워크에서 게시된 컨테이너 포트에 대한 기본 바인딩 주소가 `127.0.0.1`로 변경됩니다.
이 변경 사항이 적용되려면 데몬을 다시 시작하십시오.
또는 데몬을 시작할 때 `dockerd --ip` 플래그를 사용할 수 있습니다.

## 라우터에서 Docker 사용 {#docker-on-a-router}

Docker는 `FORWARD` 체인의 정책을 `DROP`으로 설정합니다. 이는 Docker 호스트가 라우터로 작동하는 것을 방지합니다.

시스템이 라우터로 작동하도록 하려면 `DOCKER-USER` 체인에 명시적인 `ACCEPT` 규칙을 추가해야 합니다. 예를 들어:

```bash
$ iptables -I DOCKER-USER -i src_if -o dst_if -j ACCEPT
```

## Docker가 iptables를 조작하지 못하도록 방지 {#prevent-docker-from-manipulating-iptables}

[데몬 구성](https://docs.docker.com/reference/cli/dockerd/)에서 `iptables` 또는 `ip6tables` 키를 `false`로 설정할 수 있지만, 이 옵션은 대부분의 사용자에게 적합하지 않습니다. 이는 Docker 엔진의 컨테이너 네트워킹을 중단시킬 가능성이 높습니다.

모든 컨테이너의 모든 포트는 네트워크에서 액세스 가능하며, Docker 호스트 IP 주소에서 매핑되지 않습니다.

Docker가 `iptables` 규칙을 생성하지 못하도록 완전히 방지하는 것은 불가능하며, 사후에 규칙을 생성하는 것은 매우 복잡하며 이 지침의 범위를 벗어납니다.

## firewalld와의 통합 {#integration-with-firewalld}

시스템에서 `iptables` 옵션을 `true`로 설정하고 [firewalld](https://firewalld.org)가 활성화된 상태에서 Docker를 실행하는 경우, Docker는 자동으로 대상 `ACCEPT`인 `docker`라는 `firewalld` 영역을 생성합니다.

Docker가 생성한 모든 네트워크 인터페이스(예: `docker0`)는 `docker` 영역에 삽입됩니다.

Docker는 또한 `docker` 영역으로의 전달을 허용하는 `docker-forwarding`이라는 전달 정책을 생성합니다.

## Docker와 ufw {#docker-and-ufw}

[Uncomplicated Firewall](https://launchpad.net/ufw)
(ufw)는 Debian 및 Ubuntu에 포함된 프론트엔드로, 방화벽 규칙을 관리할 수 있습니다. Docker와 ufw는 iptables를 사용하는 방식이 서로 호환되지 않습니다.

Docker를 사용하여 컨테이너의 포트를 게시할 때, 해당 컨테이너로의 트래픽은 ufw 방화벽 설정을 통과하기 전에 우회됩니다. Docker는 `nat` 테이블에서 컨테이너 트래픽을 라우팅하므로 패킷이 ufw가 사용하는 `INPUT` 및 `OUTPUT` 체인에 도달하기 전에 우회됩니다. 패킷은 방화벽 규칙이 적용되기 전에 라우팅되어 방화벽 구성을 효과적으로 무시합니다.
