---
title: 브리지 네트워크 드라이버
description: 사용자 정의 브리지 네트워크 및 기본 브리지 사용에 대한 모든 것
keywords:
  - 네트워크
  - 브리지
  - 사용자 정의
  - 독립 실행형
aliases:
  - /config/containers/bridges/
  - /engine/userguide/networking/default_network/build-bridges/
  - /engine/userguide/networking/default_network/custom-docker0/
  - /engine/userguide/networking/work-with-networks/
  - /network/bridge/
  - /network/drivers/bridge/
---

네트워킹 측면에서 브리지 네트워크는 네트워크 세그먼트 간의 트래픽을 전달하는 링크 계층 장치입니다. 브리지는 하드웨어 장치일 수도 있고 호스트 머신의 커널 내에서 실행되는 소프트웨어 장치일 수도 있습니다.

Docker 측면에서 브리지 네트워크는 동일한 브리지 네트워크에 연결된 컨테이너가 통신할 수 있도록 하는 소프트웨어 브리지를 사용하며, 해당 브리지 네트워크에 연결되지 않은 컨테이너로부터 격리됩니다. Docker 브리지 드라이버는 서로 다른 브리지 네트워크에 있는 컨테이너가 직접 통신할 수 없도록 호스트 머신에 규칙을 자동으로 설치합니다.

브리지 네트워크는 동일한 Docker 데몬 호스트에서 실행되는 컨테이너에 적용됩니다. 서로 다른 Docker 데몬 호스트에서 실행되는 컨테이너 간의 통신을 위해서는 OS 수준에서 라우팅을 관리하거나 [오버레이 네트워크](overlay.md)를 사용할 수 있습니다.

Docker를 시작하면 [기본 브리지 네트워크](#use-the-default-bridge-network) (또는 `bridge`라고도 함)가 자동으로 생성되며, 별도로 지정하지 않는 한 새로 시작된 컨테이너는 이 네트워크에 연결됩니다. 또한 사용자 정의 브리지 네트워크를 생성할 수도 있습니다. **사용자 정의 브리지 네트워크는 기본 `bridge` 네트워크보다 우수합니다.**

## 사용자 정의 브리지와 기본 브리지의 차이점 {#differences-between-user-defined-bridges-and-the-default-bridge}

- **사용자 정의 브리지는 컨테이너 간 자동으로 도메인 이름을 매핑해줍니다**.

  기본 브리지 네트워크의 컨테이너는 IP 주소로만 서로 접근할 수 있으며, [`--link` 옵션](../links.md)을 사용하지 않는 한 이는 레거시로 간주됩니다. 사용자 정의 브리지 네트워크에서는 컨테이너가 이름이나 별칭으로 서로를 인식하고 접근할 수 있습니다.

  웹 프론트엔드와 데이터베이스 백엔드가 있는 애플리케이션을 상상해 보십시오. 컨테이너 이름을 `web`과 `db`로 지정하면, 웹 컨테이너는 애플리케이션 스택이 실행되는 Docker 호스트에 상관없이 `db`에서 데이터베이스 컨테이너에 연결할 수 있습니다.

  동일한 애플리케이션 스택을 기본 브리지 네트워크에서 실행하는 경우, 컨테이너 간에 링크를 수동으로 생성해야 합니다(레거시 `--link` 플래그 사용). 이러한 링크는 양방향으로 생성해야 하므로 두 개 이상의 컨테이너가 통신해야 하는 경우 복잡해집니다. 또는 컨테이너 내의 `/etc/hosts` 파일을 조작할 수 있지만, 이는 디버그하기 어려운 문제를 일으킵니다.

- **사용자 정의 브리지는 더 나은 격리를 제공합니다**.

  `--network`를 지정하지 않은 모든 컨테이너는 기본 브리지 네트워크에 연결됩니다. 이는 관련 없는 스택/서비스/컨테이너가 통신할 수 있으므로 위험할 수 있습니다.

  사용자 정의 네트워크를 사용하면 해당 네트워크에 연결된 컨테이너만 통신할 수 있는 범위가 지정된 네트워크를 제공합니다.

- **컨테이너는 사용자 정의 네트워크에서 동적으로 연결 및 분리될 수 있습니다**.

  컨테이너의 수명 동안 사용자 정의 네트워크에서 동적으로 연결하거나 분리할 수 있습니다. 기본 브리지 네트워크에서 컨테이너를 제거하려면 컨테이너를 중지하고 다른 네트워크 옵션으로 다시 생성해야 합니다.

- **각 사용자 정의 네트워크는 구성 가능한 브리지를 생성합니다**.

  컨테이너가 기본 브리지 네트워크를 사용하는 경우 이를 구성할 수 있지만, 모든 컨테이너는 MTU 및 `iptables` 규칙과 같은 동일한 설정을 사용합니다. 또한 기본 브리지 네트워크를 구성하는 것은 Docker 외부에서 이루어지며 Docker를 재시작해야 합니다.

  사용자 정의 브리지 네트워크는 `docker network create`를 사용하여 생성 및 구성됩니다. 애플리케이션 그룹이 서로 다른 네트워크 요구 사항을 가지고 있는 경우, 생성 시 각 사용자 정의 브리지를 별도로 구성할 수 있습니다.

- **기본 브리지 네트워크에 연결된 컨테이너는 환경 변수를 공유합니다**.

  원래 두 컨테이너 간에 환경 변수를 공유하는 유일한 방법은 [`--link` 플래그](../links.md)를 사용하여 연결하는 것이었습니다. 이러한 유형의 변수 공유는 사용자 정의 네트워크에서는 불가능합니다. 그러나 환경 변수를 공유하는 더 나은 방법이 있습니다. 몇 가지 아이디어:

  - 여러 컨테이너가 Docker 볼륨을 사용하여 공유 정보를 포함하는 파일이나 디렉터리를 마운트할 수 있습니다.

  - 여러 컨테이너를 `docker-compose`를 사용하여 함께 시작하고 compose 파일에서 공유 변수를 정의할 수 있습니다.

  - 독립 실행형 컨테이너 대신 스웜 서비스를 사용하고 공유 [비밀](/manuals/engine/swarm/secrets.md) 및 [구성](/manuals/engine/swarm/configs.md)을 활용할 수 있습니다.

동일한 사용자 정의 브리지 네트워크에 연결된 컨테이너는 사실상 모든 포트를 서로에게 노출합니다. 다른 네트워크의 컨테이너나 비-Docker 호스트에서 포트에 접근하려면 해당 포트를 `-p` 또는 `--publish` 플래그를 사용하여 _게시_ 해야 합니다.

## 옵션 {#options}

다음 표는 `bridge` 드라이버를 사용하여 사용자 정의 네트워크를 생성할 때 `--option`에 전달할 수 있는 드라이버별 옵션을 설명합니다.

| 옵션                                                                                            | 기본값                 | 설명                                                                                  |
| ----------------------------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------- |
| `com.docker.network.bridge.name`                                                                |                        | Linux 브리지를 생성할 때 사용할 인터페이스 이름.                                      |
| `com.docker.network.bridge.enable_ip_masquerade`                                                | `true`                 | IP 마스커레이딩 활성화.                                                               |
| `com.docker.network.bridge.gateway_mode_ipv4`<br/>`com.docker.network.bridge.gateway_mode_ipv6` | `nat`                  | NAT 및 마스커레이딩 활성화 (`nat`), 또는 컨테이너로의 직접 라우팅만 허용 (`routed`).  |
| `com.docker.network.bridge.enable_icc`                                                          | `true`                 | 컨테이너 간 연결 활성화 또는 비활성화.                                                |
| `com.docker.network.bridge.host_binding_ipv4`                                                   | 모든 IPv4 및 IPv6 주소 | 컨테이너 포트를 바인딩할 때 기본 IP.                                                  |
| `com.docker.network.driver.mtu`                                                                 | `0` (제한 없음)        | 컨테이너 네트워크 최대 전송 단위 (MTU) 설정.                                          |
| `com.docker.network.container_iface_prefix`                                                     | `eth`                  | 컨테이너 인터페이스에 대한 사용자 정의 접두사 설정.                                   |
| `com.docker.network.bridge.inhibit_ipv4`                                                        | `false`                | 네트워크에 IP 주소를 [할당하지 않도록](#skip-ip-address-configuration) Docker를 방지. |

이러한 옵션 중 일부는 `dockerd` CLI의 플래그로도 사용할 수 있으며, Docker 데몬을 시작할 때 기본 `docker0` 브리지를 구성하는 데 사용할 수 있습니다. 다음 표는 `dockerd` CLI에서 동등한 플래그가 있는 옵션을 보여줍니다.

| 옵션                                             | 플래그      |
| ------------------------------------------------ | ----------- |
| `com.docker.network.bridge.name`                 | -           |
| `com.docker.network.bridge.enable_ip_masquerade` | `--ip-masq` |
| `com.docker.network.bridge.enable_icc`           | `--icc`     |
| `com.docker.network.bridge.host_binding_ipv4`    | `--ip`      |
| `com.docker.network.driver.mtu`                  | `--mtu`     |
| `com.docker.network.container_iface_prefix`      | -           |

Docker 데몬은 `--bridge` 플래그를 지원하며, 이를 사용하여 자체 `docker0` 브리지를 정의할 수 있습니다. 동일한 호스트에서 여러 데몬 인스턴스를 실행하려는 경우 이 옵션을 사용하십시오. 자세한 내용은 [여러 데몬 실행](/reference/cli/dockerd.md#run-multiple-daemons)을 참조하십시오.

### 기본 호스트 바인딩 주소 {#default-host-binding-address}

포트 게시 옵션에서 `-p 80` 또는 `-p 8080:80`과 같이 호스트 주소를 지정하지 않은 경우, 기본값은 모든 호스트 주소(IPv4 및 IPv6)에서 컨테이너의 포트 80을 사용할 수 있도록 하는 것입니다.

브리지 네트워크 드라이버 옵션 `com.docker.network.bridge.host_binding_ipv4`를 사용하여 게시된 포트의 기본 주소를 수정할 수 있습니다.

옵션 이름에도 불구하고 IPv6 주소를 지정할 수 있습니다.

기본 바인딩 주소가 특정 인터페이스에 할당된 주소인 경우, 해당 주소를 통해서만 컨테이너의 포트에 접근할 수 있습니다.

기본 바인딩 주소를 `::`로 설정하면 게시된 포트는 호스트의 IPv6 주소에서만 사용할 수 있습니다. 그러나 이를 `0.0.0.0`으로 설정하면 호스트의 IPv4 및 IPv6 주소에서 사용할 수 있습니다.

게시된 포트를 IPv4에만 제한하려면 컨테이너의 게시 옵션에 주소를 포함해야 합니다. 예를 들어, `-p 0.0.0.0:8080:80`.

## 사용자 정의 브리지 관리 {#manage-a-user-defined-bridge}

`docker network create` 명령을 사용하여 사용자 정의 브리지 네트워크를 생성합니다.

```bash
$ docker network create my-net
```

서브넷, IP 주소 범위, 게이트웨이 및 기타 옵션을 지정할 수 있습니다. 자세한 내용은 [docker network create](/reference/cli/docker/network/create.md#specify-advanced-options) 참조 또는 `docker network create --help`의 출력을 참조하십시오.

`docker network rm` 명령을 사용하여 사용자 정의 브리지 네트워크를 제거할 수 있습니다. 네트워크에 현재 컨테이너가 연결되어 있는 경우, 먼저 [연결을 해제](#disconnect-a-container-from-a-user-defined-bridge)하십시오.

```bash
$ docker network rm my-net
```

> **무슨 일이 일어나고 있나요?**
>
> 사용자 정의 브리지를 생성하거나 제거하거나 컨테이너를 사용자 정의 브리지에 연결하거나 연결을 해제할 때, Docker는 운영 체제에 특정한 도구를 사용하여 기본 네트워크 인프라를 관리합니다(예: 브리지 장치 추가 또는 제거 또는 Linux에서 `iptables` 규칙 구성). 이러한 세부 사항은 구현 세부 사항으로 간주되어야 합니다. Docker가 사용자 정의 네트워크를 관리하도록 하십시오.

## 컨테이너를 사용자 정의 브리지에 연결 {#connect-a-container-to-a-user-defined-bridge}

새 컨테이너를 생성할 때 하나 이상의 `--network` 플래그를 지정할 수 있습니다. 이 예제는 Nginx 컨테이너를 `my-net` 네트워크에 연결합니다. 또한 컨테이너의 포트 80을 Docker 호스트의 포트 8080에 게시하여 외부 클라이언트가 해당 포트에 접근할 수 있도록 합니다. `my-net` 네트워크에 연결된 다른 컨테이너는 모두 `my-nginx` 컨테이너의 모든 포트에 접근할 수 있으며, 그 반대도 마찬가지입니다.

```bash
$ docker create --name my-nginx \
  --network my-net \
  --publish 8080:80 \
  nginx:latest
```

실행 중인 **컨테이너를** 기존 사용자 정의 브리지에 연결하려면 `docker network connect` 명령을 사용하십시오. 다음 명령은 이미 실행 중인 `my-nginx` 컨테이너를 이미 존재하는 `my-net` 네트워크에 연결합니다:

```bash
$ docker network connect my-net my-nginx
```

## 컨테이너를 사용자 정의 브리지에서 분리 {#disconnect-a-container-from-a-user-defined-bridge}

실행 중인 컨테이너를 사용자 정의 브리지에서 분리하려면 `docker network disconnect` 명령을 사용하십시오. 다음 명령은 `my-nginx` 컨테이너를 `my-net` 네트워크에서 분리합니다.

```bash
$ docker network disconnect my-net my-nginx
```

## 사용자 정의 브리지 네트워크에서 IPv6 사용 {#use-ipv6-in-a-user-defined-bridge-network}

네트워크를 생성할 때 `--ipv6` 플래그를 지정하여 IPv6을 활성화할 수 있습니다.

```bash
$ docker network create --ipv6 --subnet 2001:db8:1234::/64 my-net
```

## 기본 브리지 네트워크 사용 {#use-the-default-bridge-network}

기본 `bridge` 네트워크는 Docker의 레거시 세부 사항으로 간주되며 프로덕션 사용에는 권장되지 않습니다. 이를 구성하는 것은 수동 작업이며, [기술적 단점](#differences-between-user-defined-bridges-and-the-default-bridge)이 있습니다.

### 기본 브리지 네트워크에 컨테이너 연결 {#connect-a-container-to-the-default-bridge-network}

`--network` 플래그를 사용하여 네트워크를 지정하지 않고 네트워크 드라이버를 지정한 경우, 컨테이너는 기본 `bridge` 네트워크에 기본적으로 연결됩니다. 기본 `bridge` 네트워크에 연결된 컨테이너는 통신할 수 있지만, [레거시 `--link` 플래그](../links.md)를 사용하지 않는 한 IP 주소로만 통신할 수 있습니다.

### 기본 브리지 네트워크 구성 {#configure-the-default-bridge-network}

기본 `bridge` 네트워크를 구성하려면 `daemon.json`에 옵션을 지정합니다. 다음은 여러 옵션이 지정된 예제 `daemon.json`입니다. 필요한 설정만 지정하십시오.

```json
{
  "bip": "192.168.1.1/24",
  "fixed-cidr": "192.168.1.0/25",
  "mtu": 1500,
  "default-gateway": "192.168.1.254",
  "dns": ["10.20.1.2", "10.20.1.3"]
}
```

변경 사항을 적용하려면 Docker를 재시작하십시오.

### 기본 브리지 네트워크에서 IPv6 사용 {#use-ipv6-with-the-default-bridge-network}

기본 브리지에 대해 IPv6을 활성화하려면 `daemon.json`에 다음 옵션을 지정하거나 해당 명령줄 동등 항목을 사용하십시오.

이 세 가지 옵션은 기본 브리지에만 영향을 미치며, 사용자 정의 네트워크에서는 사용되지 않습니다. 아래의 주소는 IPv6 문서 범위의 예제입니다.

- 옵션 `ipv6`는 필수입니다.
- 옵션 `fixed-cidr-v6`는 필수이며, 사용될 네트워크 접두사를 지정합니다.
  - 접두사는 일반적으로 `/64` 또는 더 짧아야 합니다.
  - 로컬 네트워크에서 실험할 때는 링크 로컬 접두사(`fe80::/10`)보다 고유 로컬 접두사(`fd00::/8`)를 사용하는 것이 좋습니다.
- 옵션 `default-gateway-v6`는 선택 사항입니다. 지정하지 않으면 기본값은 `fixed-cidr-v6` 서브넷의 첫 번째 주소입니다.

```json
{
  "ipv6": true,
  "fixed-cidr-v6": "2001:db8::/64",
  "default-gateway-v6": "2001:db8:abcd::89"
}
```

## 브리지 네트워크의 연결 제한 {#connection-limit-for-bridge-networks}

Linux 커널에서 설정한 제한으로 인해, 브리지 네트워크에 1000개 이상의 컨테이너가 연결되면 브리지 네트워크가 불안정해지고 컨테이너 간 통신이 끊길 수 있습니다.

이 제한에 대한 자세한 내용은 [moby/moby#44973](https://github.com/moby/moby/issues/44973#issuecomment-1543747718)를 참조하십시오.

## IP 주소 구성 건너뛰기 {#skip-ip-address-configuration}

`com.docker.network.bridge.inhibit_ipv4` 옵션을 사용하면 기존 브리지를 사용하는 네트워크를 생성하고 Docker가 브리지에 IPv4 주소를 구성하지 않도록 할 수 있습니다. 이는 브리지에 물리적 인터페이스를 추가하고 해당 IP 주소를 브리지 인터페이스로 이동해야 하는 경우와 같이 IP 주소를 수동으로 구성하려는 경우에 유용합니다.

이 옵션을 사용하려면 `daemon.json`의 `bridge` 옵션을 사용하거나 `dockerd --bridge` 플래그를 사용하여 자체 관리 브리지를 사용하도록 Docker 데몬을 먼저 구성해야 합니다.

이 구성에서는 수동으로 브리지의 IP 주소를 구성하지 않는 한 북-남 트래픽이 작동하지 않습니다.

## 다음 단계 {#next-steps}

- [독립 실행형 네트워킹 튜토리얼](/manuals/engine/network/tutorials/standalone.md)을 진행하십시오.
- [컨테이너 관점에서의 네트워킹](../_index.md)에 대해 알아보십시오.
- [오버레이 네트워크](./overlay.md)에 대해 알아보십시오.
- [Macvlan 네트워크](./macvlan.md)에 대해 알아보십시오.
