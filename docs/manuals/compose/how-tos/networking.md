---
description: Docker Compose가 컨테이너 간 네트워킹을 설정하는 방법
keywords:
  - 문서
  - 도커
  - 컴포즈
  - 오케스트레이션
  - 컨테이너
  - 네트워킹
title: 컴포즈에서의 네트워킹
linkTitle: 네트워킹
weight: 70
aliases:
  - /compose/networking/
---

:::important
Docker의 문서는 Compose V2의 기능을 참조하고 설명합니다.

2023년 7월부터 Compose V1은 업데이트가 중단되었으며 새로운 Docker Desktop 릴리스에서는 더 이상 제공되지 않습니다. [Compose V2](/compose/migrate)가 이를 대체하였으며 현재 모든 Docker Desktop 버전에 통합되어 있습니다. 자세한 내용은 Compose V2로의 마이그레이션을 참조하세요.
:::

기본적으로 Compose는 앱을 위한 단일
[네트워크](/reference/cli/docker/network/create.md)를 설정합니다. 각
서비스의 컨테이너는 기본 네트워크에 연결되며, 해당 네트워크의 다른 컨테이너에 의해 접근 가능하고 서비스 이름으로 검색할 수 있습니다.

:::note
앱의 네트워크는 "프로젝트 이름"을 기반으로 이름이 지정되며, 이는 해당 디렉토리의 이름을 기반으로 합니다. [`--project-name` 플래그](/reference/cli/docker/compose.md) 또는 [`COMPOSE_PROJECT_NAME` 환경 변수](environment-variables/envvars.md#compose_project_name)를 사용하여 프로젝트 이름을 재정의할 수 있습니다.
:::

예를 들어, 앱이 `myapp`이라는 디렉토리에 있고 `compose.yml`이 다음과 같다고 가정해 봅시다:

```yaml
services:
  web:
    build: .
    ports:
      - "8000:8000"
  db:
    image: postgres
    ports:
      - "8001:5432"
```

`docker compose up`을 실행하면 다음과 같은 일이 발생합니다:

1. `myapp_default`라는 네트워크가 생성됩니다.
2. `web`의 설정을 사용하여 컨테이너가 생성됩니다. 이 컨테이너는 `myapp_default` 네트워크에 `web`이라는 이름으로 연결됩니다.
3. `db`의 설정을 사용하여 컨테이너가 생성됩니다. 이 컨테이너는 `myapp_default` 네트워크에 `db`라는 이름으로 연결됩니다.

이제 각 컨테이너는 서비스 이름 `web` 또는 `db`를 조회하여 적절한 컨테이너의 IP 주소를 얻을 수 있습니다. 예를 들어, `web`의 애플리케이션 코드는 `postgres://db:5432` URL에 연결하여 Postgres 데이터베이스를 사용할 수 있습니다.

`HOST_PORT`와 `CONTAINER_PORT`의 차이를 이해하는 것이 중요합니다. 위의 예에서 `db`의 경우 `HOST_PORT`는 `8001`이고 컨테이너 포트는 `5432`(postgres 기본값)입니다. 네트워크 서비스 간 통신은 `CONTAINER_PORT`를 사용합니다. `HOST_PORT`가 정의되면 서비스는 스웜 외부에서도 접근 가능합니다.

`web` 컨테이너 내에서 `db`에 대한 연결 문자열은 `postgres://db:5432`처럼 보일 것이며, 호스트 머신에서는 `postgres://{DOCKER_IP}:8001`처럼 보일 것입니다. 예를 들어, 컨테이너가 로컬에서 실행 중이라면 `postgres://localhost:8001`처럼 보일 것입니다.

## 네트워크의 컨테이너 업데이트 {#update-containers-on-the-network}

서비스의 설정을 변경하고 `docker compose up`을 실행하여 업데이트하면, 이전 컨테이너가 제거되고 새 컨테이너가 동일한 이름으로 네트워크에 연결되지만 다른 IP 주소를 갖게 됩니다. 실행 중인 컨테이너는 해당 이름을 조회하여 새 주소에 연결할 수 있지만, 이전 주소는 작동을 멈춥니다.

어떤 컨테이너가 이전 컨테이너에 대한 연결을 열어두고 있다면, 해당 연결은 닫힙니다. 컨테이너는 이 조건을 감지하고 이름을 다시 조회하여 재연결해야 합니다.

:::tip
가능한 한 IP가 아닌 이름으로 컨테이너를 참조하십시오. 그렇지 않으면 사용 중인 IP 주소를 계속 업데이트해야 합니다.
:::

## 컨테이너 연결 {#link-containers}

링크를 사용하면 서비스가 다른 서비스에서 접근할 수 있는 추가 별칭을 정의할 수 있습니다. 서비스 간 통신을 가능하게 하기 위해 링크가 필요하지는 않습니다. 기본적으로 모든 서비스는 해당 서비스 이름으로 다른 모든 서비스에 접근할 수 있습니다. 다음 예제에서 `db`는 `web`에서 `db` 및 `database`라는 호스트 이름으로 접근할 수 있습니다:

```yaml
services:
  web:
    build: .
    links:
      - "db:database"
  db:
    image: postgres
```

자세한 내용은 [링크 참조](/reference/compose-file/services.md#links)를 참조하십시오.

## 멀티 호스트 네트워킹 {#multi-host-networking}

[스웜 모드가 활성화된](/manuals/engine/swarm/_index.md) Docker Engine에서 Compose 애플리케이션을 배포할 때, 내장된 `overlay` 드라이버를 사용하여 멀티 호스트 통신을 활성화할 수 있습니다.

오버레이 네트워크는 항상 `attachable`로 생성됩니다. 선택적으로 [`attachable`](/reference/compose-file/networks.md#attachable) 속성을 `false`로 설정할 수 있습니다.

스웜 클러스터 설정 방법은 [스웜 모드 섹션](/manuals/engine/swarm/_index.md)을 참조하고, 멀티 호스트 오버레이 네트워크에 대한 자세한 내용은 [멀티 호스트 네트워킹 시작하기](/manuals/engine/network/tutorials/overlay.md)를 참조하십시오.

## 사용자 정의 네트워크 지정 {#specify-custom-networks}

기본 앱 네트워크를 사용하는 대신, 최상위 `networks` 키를 사용하여 사용자 정의 네트워크를 지정할 수 있습니다. 이를 통해 더 복잡한 토폴로지를 만들고 [사용자 정의 네트워크 드라이버](/engine/extend/plugins_network/) 및 옵션을 지정할 수 있습니다. 또한 Compose에서 관리하지 않는 외부 생성 네트워크에 서비스를 연결하는 데 사용할 수도 있습니다.

각 서비스는 서비스 수준의 `networks` 키를 사용하여 연결할 네트워크를 지정할 수 있으며, 이는 최상위 `networks` 키 아래의 항목을 참조하는 이름 목록입니다.

다음 예제는 두 개의 사용자 정의 네트워크를 정의하는 Compose 파일을 보여줍니다. `proxy` 서비스는 `db` 서비스와 네트워크를 공유하지 않기 때문에 격리됩니다. 오직 `app`만이 둘 다와 통신할 수 있습니다.

```yaml
services:
  proxy:
    build: ./proxy
    networks:
      - frontend
  app:
    build: ./app
    networks:
      - frontend
      - backend
  db:
    image: postgres
    networks:
      - backend

networks:
  frontend:
    # 드라이버 옵션 지정
    driver: bridge
    driver_opts:
      com.docker.network.bridge.host_binding_ipv4: "127.0.0.1"
  backend:
    # 사용자 정의 드라이버 사용
    driver: custom-driver
```

네트워크는 각 연결된 네트워크에 대해 [ipv4_address 및/또는 ipv6_address](/reference/compose-file/services.md#ipv4_address-ipv6_address)를 설정하여 정적 IP 주소로 구성할 수 있습니다.

네트워크는 [사용자 정의 이름](/reference/compose-file/networks.md#name)을 지정할 수도 있습니다:

```yaml
services:
  # ...
networks:
  frontend:
    name: custom_frontend
    driver: custom-driver-1
```

## 기본 네트워크 구성 {#configure-the-default-network}

자신의 네트워크를 지정하는 대신 또는 그와 함께, `default`라는 이름의 항목을 `networks` 아래에 정의하여 앱 전체의 기본 네트워크 설정을 변경할 수 있습니다:

```yaml
services:
  web:
    build: .
    ports:
      - "8000:8000"
  db:
    image: postgres

networks:
  default:
    # 사용자 정의 드라이버 사용
    driver: custom-driver-1
```

## 기존 네트워크 사용 {#use-a-pre-existing-network}

컨테이너가 기존 네트워크에 연결되도록 하려면 [`external` 옵션](/reference/compose-file/networks.md#external)을 사용하십시오.

```yaml
services:
  # ...
networks:
  network1:
    name: my-pre-existing-network
    external: true
```

Compose는 `[projectname]_default`라는 네트워크를 생성하려고 시도하는 대신, `my-pre-existing-network`라는 네트워크를 찾아 앱의 컨테이너를 해당 네트워크에 연결합니다.

## 추가 참조 정보 {#further-reference-information}

사용 가능한 네트워크 구성 옵션의 전체 세부 사항은 다음 참조를 참조하십시오:

- [최상위 `networks` 요소](/reference/compose-file/networks.md)
- [서비스 수준 `networks` 속성](/reference/compose-file/services.md#networks)
